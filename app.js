const express = require('express')
const path =  require('path')
const logger = require('morgan')
const Pool = require('./database')

//app
const app = express()

//Routers
const questionsRouter = require('./Routes/questions')


//Express middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))

//change this later
if(app.get('env') === 'developement'){
    console.log(`${app.get('env')}`)
}


//Middleware
app.use('/api/v1/questions', questionsRouter)


//Table to store all the questions 
Pool.query('CREATE TABLE IF NOT EXISTS questions_table(id SERIAL PRIMARY KEY, userId SERIAL, question TEXT NOT NULL)')
.then(res => {console.log(`Stuffs went well \n ${res.rows}`)})
.catch(new Error().message)


//Table to store all the answers
Pool.query('CREATE TABLE IF NOT EXISTS answers_table(id SERIAL PRIMARY KEY, questionId SERIAL, answer TEXT NOT NULL, status BOOLEAN)')
.then(res => {console.log('Answers table created...')})
.catch(e => {console.log('answers table not created...')})

module.exports = app

