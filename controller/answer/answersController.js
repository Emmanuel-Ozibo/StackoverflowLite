const pool = require('../../database')

const postAnswerString = 'INSERT INTO answers_table(questionId, answer, status, userId) VALUES($1, $2, $3, $4) RETURNING *'

const getAnswerString = 'SELECT userid FROM answers_table WHERE id = $1'

const updateAnAnswer = 'UPDATE answers_table SET answer = $1 WHERE id = $2'

const askQuestionUserId = 'SELECT userid FROM questions_table WHERE id = $1'

const acceptAnswerString = 'UPDATE answers_table SET status = $1 WHERE id = $2'


exports.postAnswer = (req, res) =>{
    const answer = {
        questionId: req.params.questionId, 
        answer: req.body.answer,
        userId: req.body.userId
    }

    values = [`${answer.questionId}`, `${answer.answer}`, false, `${answer.userId}`]

    pool.query(postAnswerString, values)
    .then(response => {
        res.send(response.rows[0])
    })
    .catch(e => {
        console.log(`${e.stack}`)
        res.send(e)
    })
}

exports.updateAnswer = (req, res) => {
    
   const ansId = req.params.answerId
   const uId = req.body.userId 
   const newAnswer = req.body.answer

    //get the id of who answered the question 
    pool.query(getAnswerString, [ansId])
    .then(result => {
        const id = result.rows[0].userId
        if(uId === id){
            pool.query(updateAnAnswer, [newAnswer, ansId])
            .then(resul =>{
                res.status(200).send(resul.rows[0])
            })
            .catch(eror => {
                res.status(505).send({status: 'failed', message: 'Cannot update answer.'})
            })
        }else{
            res.status(400).send({status: 'failed', message: 'UnAuthorized'})
        }
    })
}



exports.acceptAnswer = (req, res) => {

    const userId = req.body.userId
    const answerId = req.params.answerId
    const questionId = req.body.questionId
    const status = req.body.status

    pool.query(askQuestionUserId, [questionId])
    .then(result1 => {
        if(userId === result1.rows[0].userid){
            pool.query(acceptAnswerString, [status,answerId])
            .then(result => {
                res.send(result.rows[0])
            })
            .catch(err => {
                res.status(505).send({message: 'Unable to update answer.'})
            })
        }else{
            res.status(400).send({message: 'UnAuthorized to perform this operation.'})
        }
    })
    .catch(error => {
        res.status(505).send({message: 'Unable to update answer.', data: error()})
    })
}
