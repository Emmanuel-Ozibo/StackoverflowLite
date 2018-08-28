const pool = require('../../database')


const getAllQuestions = 'SELECT * FROM questions_table ORDER BY id ASC'

//This is an sql query to get the answers of a particular question using its id
const allAnswers = 'SELECT answer,status FROM answers_table WHERE questionid = $1'

//This sql query helps to get a particular question with :questionId
const getSingleQuestion = 'SELECT * FROM questions_table WHERE id = $1'

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
    let question
    let answers
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
