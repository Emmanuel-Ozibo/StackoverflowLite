const pool = require('../../database')
const _ = require('lodash')

//sql Query to insert comment in db
const insertComment = 'INSERT INTO comments_table(answerid, userid, username, comment) VALUES($1, $2, $3, $4) RETURNING *'

//SQL QUERY TO GET ALL COMMENTS 
const getComments = 'SELECT username, comment FROM comments_table WHERE answerid = $1'




exports.insertComment = async (req, res) => {
    //insert comments
    const ansId = req.params.answerId
    const comment = req.body.comment
    const user = req.user

    try {
        const commentRes = await pool.query(insertComment, [ansId, `${user.id}`, `${user.username}`, comment])
        res.send(commentRes.rows[0])
    } catch (error){
        console.log(error)
        res.status(505).send(`Internal server error: ${error}`)
    }
}




exports.getComments = async (req, res) => {
    //get comments
    const ansId = req.params.answerId

    try {
        const comments = await pool.query(getComments, [ansId])
        res.send({status: 'success', comments: comments.rows})
    } catch (error) {
        console.log(error)
        res.status(505).send(`Internal server error: ${error}`)
    }
}