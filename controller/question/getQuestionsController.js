const pool = require('../../database')



const getAllQuestions = 'SELECT * FROM questions_table ORDER BY id ASC'

//This is an sql query to get the answers of a particular question using its id
const allAnswers = 'SELECT answer,status FROM answers_table WHERE questionid = $1'

//This sql query helps to get a particular question with :questionId
const getSingleQuestion = 'SELECT * FROM questions_table WHERE id = $1'

//This sql query gets the user id for a question
const getUserIdForQuestion = 'SELECT userId FROM questions_table WHERE id = $1'

//delete question
const deleteQuestion = 'DELETE FROM questions_table WHERE id = $1'





exports.getQuestions = (req, res) => {
    pool.query(getAllQuestions)
    .then(response => {
        res.send(response.rows)//returns a list of questions
    })
    .catch(e => {
        console.error(e.stack)
        res.send('Cant fetch users')
    })

}





exports.setSingleQuestion = (req, res) =>{
//get the question from the table, then use the id to fetch the answers
    const questionId = req.params.questionId

    const questionPromise = pool.query(getSingleQuestion, [questionId])
    const answersPromise = pool.query(allAnswers, [questionId])

    Promise.all([questionPromise, answersPromise])
    .then(result => {
    
        const response = {
            question: result["0"].rows[0], 
            answers: result["1"].rows
        }
        res.send(response)
    })
    .catch(err => {
        console.log(`some shitty error occured: ${err}`)
        res.send(err.stack)
    })
}




exports.deleteQuestion = (req, res) => {
    const quesId = req.params.questionId
    const userId = req.body.userId
    
    pool.query(getUserIdForQuestion, [quesId])
    .then(result => {
        const mUserId = result.rows[0].userid
        if(mUserId === userId){
            pool.query(deleteQuestion, [quesId])
            .then(rest => {
                res.status(200).send({status: 'Okay', message: 'Question deleted.'})
            })
            .catch(error => {
                console.log({status: 'failed', message: {error: error('There was an error here!')}})
                res.status(400).send(error)
            })
        }else{
            res.status(400).send({status: 'failed', message: 'Access denied!!'})
        }
    })
    .catch(err => {

    })
}
