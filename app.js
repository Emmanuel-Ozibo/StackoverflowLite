const express = require('express')
const path =  require('path')
const logger = require('morgan')
const Pool = require('./database')
const config = require('config')
const cors = require('cors')

//make this token visible
const corParams = { 
    exposedHeaders: ['x-auth-token']
}

//app
const app = express()

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey not set')
    process.exit(1)
}


//Routers
const questionsRouter = require('./Routes/questions')
const authRouter = require('./Routes/authRoute')



//Express middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
app.use(cors(corParams))


//change this later
if(app.get('env') === 'developement'){
    console.log(`${app.get('env')}`)
}


//Routes Middleware
app.use('/api/v1/questions', questionsRouter)
app.use('/api/v1/auth', authRouter)


//Table to store users
Pool.query('CREATE TABLE IF NOT EXISTS users_table(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)')
.then(result => {console.log(`users table created ${result.rows}`)})
.catch(error => {console.log(`Failed to create users table: ${error}`)})


//Table to store all the questions 
Pool.query('CREATE TABLE IF NOT EXISTS questions_table(id SERIAL PRIMARY KEY, userId UUID,username TEXT NOT NULL, question TEXT NOT NULL)')
.then(res => {console.log(`Stuffs went well \n ${res.rows}`)})
.catch(new Error().message)


//Table to store all the answers
Pool.query('CREATE TABLE IF NOT EXISTS answers_table(id SERIAL PRIMARY KEY, questionId SERIAL, answer TEXT NOT NULL, status BOOLEAN, userId UUID, username TEXT NOT NULL, upvotes INT, downvotes INT)')
.then(res => {console.log('Answers table created...')})
.catch(e => {console.log('answers table not created...')})


//Table to store all comments
Pool.query('CREATE TABLE IF NOT EXISTS comments_table(id SERIAL PRIMARY KEY, answerid SERIAL, userid TEXT NOT NULL, username TEXT NOT NULL, comment TEXT NOT NULL)')
.then(result => {console.log('Comments table created...')})
.catch(error => {console.log(error)})

module.exports = app