const express = require('express')
const path =  require('path')
const logger = require('morgan')
const Pool = require('./database')

//app
const app = express()

//Routers
const insertUserRouter = require('./Routes/questions')


//Express middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

//change this later
if(app.get('env') === 'developement'){
    console.log(`${app.get('dev')}`)
    app.use(logger('dev'))
}


//Middle
app.use('/api/v1/questions', insertUserRouter)

Pool.query('CREATE TABLE IF NOT EXISTS questions_table(id SERIAL PRIMARY KEY, userId SERIAL, question TEXT NOT NULL)')
.then(res => {console.log(`Stuffs went well \n ${res.rows}`)})
.catch(new Error().message)

module.exports = app

