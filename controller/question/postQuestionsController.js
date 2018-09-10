import pool from "../../database"
import _ from "lodash"



const insertQuestionString = 'INSERT INTO questions_table(userId,userName, question) VALUES($1, $2, $3) RETURNING *'

exports.insertQuestion =async (req, res) =>{
    const user = {
        userId: req.user.id, 
        question: req.body.question
    }


    const Requser = req.user
    const values = [`${user.userId}`,`${Requser.username}`, `${user.question}`]
    
    
    try {
        const questions = await pool.query(insertQuestionString, values)
        const responseObject = _.pick(Requser, ['id','username'])
        const question = questions.rows[0].question
        res.status(200).send({question: question, user: responseObject})
    } catch (error) {
        res.status(400).send(error)
    }

}