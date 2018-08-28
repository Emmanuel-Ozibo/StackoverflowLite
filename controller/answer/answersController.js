const pool = require('../../database')

const postAnswerString = 'INSERT INTO answers_table(questionId, answer, status) VALUES($1, $2, $3) RETURNING *'

exports.postAnswer = (req, res) =>{
    const answer = {
        questionId: req.params.questionId, 
        answer: req.body.answer
    }

    values = [`${answer.questionId}`, `${answer.answer}`, false]

    pool.query(postAnswerString, values)
    .then(response => {
        res.send(response.rows[0])
    })
    .catch(e => {
        console.log(`${e.stack}`)
        res.send(e)
    })
}

exports.editAnswers = (req, res) => {
    //Not yet implemented
}
