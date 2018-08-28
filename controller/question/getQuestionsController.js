const pool = require('../../database')
const queryString = 'SELECT * FROM questions_table ORDER BY id ASC'

exports.getQuestion = (req, res) => {
    pool.query(queryString)
    .then(response => {
        res.send(response.rows)//returns a list of questions
    })
    .catch(e => {
        console.error(e.stack)
        res.send('Cant fetch users')
    })

}
