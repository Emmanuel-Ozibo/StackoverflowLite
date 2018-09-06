const pool = require('../../database')
const _ = require('lodash')

const postAnswerString = 'INSERT INTO answers_table(questionId, answer, status, userId, username, upvotes, downvotes) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'

const getUserThatAnsweredquestion = 'SELECT userid FROM answers_table WHERE id = $1'

const updateAnAnswer = 'UPDATE answers_table SET answer = $1 WHERE id = $2'

const askQuestionUserId = 'SELECT userid FROM questions_table WHERE id = $1'

const acceptAnswerString = 'UPDATE answers_table SET status = $1 WHERE id = $2'

const totalUpvotes = 'SELECT upvotes FROM answers_table WHERE id = $1'

const upvote = 'UPDATE answers_table SET upvotes = $1 WHERE  id = $2'

const totalDownVotes = 'SELECT downvotes FROM answers_table WHERE id = $1'

const downVote = 'UPDATE answers_table SET downvotes = $1 WHERE id = $2'



exports.postAnswer = async (req, res) =>{

    const answer = {
        questionId: req.params.questionId, 
        answer: req.body.answer
    }

    const user = req.user

    values = [`${answer.questionId}`, `${answer.answer}`, false, `${user.id}`, `${user.username}`, 0, 0]

    try {
        const answerResponse = await pool.query(postAnswerString, values)
        const answerDetail = answerResponse.rows[0]
        const userDetails = _.pick(user, ['username', 'email'])
        res.send({answer_detail: answerDetail, user_details: userDetails})
    } catch (error) {
        console.log(`${error.stack}`)
        res.status(400).send(error)
    }
   
}



const updateAnswer = async (answerId, newAnswer, res) =>{
    pool.query(updateAnAnswer, [newAnswer, answerId])
    .then(result => {
        res.send({status: 'success', message: 'Answer updated.'})
    })
    .catch(error => {
        res.status(505).send(`Cannot update answer, internal server error: ${error.message}`)
    })
}


exports.modifyAnswer = async (req, res) => {
    const userDetails = req.userDetails
    const userId = userDetails.id
    const answerId = req.params.answerId
    const questionId = req.params.questionId

    try {
        //query the answers table to check if the user is present
        const result =await pool.query(getUserThatAnsweredquestion, [answerId])
        const questionResult =  await pool.query(askQuestionUserId, [questionId])

        //if none of this is present 
        if(result.rows[0].userid !== userId && questionResult.rows[0].userid !== userId) return res.status(401).send('UnAuthorized..')

        console.log(`${result.rows[0].userid},\n${questionResult.rows[0].userid}`)
        if(result.rows[0].userid === userId){
            //update answer
            updateAnswer(answerId, req.body.answer, res)
        }else{
            //accept the answer
            acceptAnswer(answerId, req.body.status, res)
        }

    }catch (error){
        res.status(505).send(`Internal server error1: ${error}`)
    }

}


const acceptAnswer = (answerId, status, res) => {
    pool.query(acceptAnswerString, [status, answerId])
    .then(result => {
        res.send({status: 'success', message: 'Answer Accepted.'})
    })
    .catch(error => {
        res.status(505).send(`Cannot accept answer, Internal server error: ${error.message}`)
    })
}



exports.upvoteAnAnswer = async (req, res) => {
    const ansId = req.params.answerId
    const user = req.user
    
    try {
        const tUpvotes = await pool.query(totalUpvotes, [ansId])
        const total_count = tUpvotes.rows[0].upvotes + 1
        console.log(total_count)
        const upvoteQuestion = await pool.query(upvote, [total_count, ansId])
        //confirm.log(upvoteQuestion)
        res.send({status: 'success', message: `upvoted: ${total_count}`})
    } catch (error) {
        res.status(505).send(`Something went wrong: ${error}`)
    }
}



exports.downvoteAnswer = async (req, res) => {
    const ansId = req.params.answerId

    try {
        const tDownVotes = await pool.query(totalDownVotes, [ansId])
        const count = tDownVotes.rows[0].downvotes + 1
        const downVoteQuestion = await pool.query(count, [ansId])

        res.send({
            status: 'success', 
            message: 'downvoted!'
        })

    } catch (error) {
        res.status(505).send(`Something went wrong: ${error}`)
    }
}
