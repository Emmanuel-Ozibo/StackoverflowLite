import express from "express"
import path from "path"
import logger from "morgan"
import Pool from "./database"
import config from "config"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"


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
app.use(helmet())
app.use(compression())


//change this later
if(app.get('env') === 'developement'){
    console.log(`${app.get('env')}`)
}


//Routes Middleware
app.use('/api/v1/questions', questionsRouter)
app.use('/api/v1/auth', authRouter)

//create uuid generator
const p1 =  Pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
//Table to store users
const p2 =  Pool.query('CREATE TABLE IF NOT EXISTS users_table(id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)')
//Table to store all the questions 
const p3 = Pool.query('CREATE TABLE IF NOT EXISTS questions_table(id SERIAL PRIMARY KEY, userId UUID,username TEXT NOT NULL, question TEXT NOT NULL)')
//Table to store all the answers
const p4 =  Pool.query('CREATE TABLE IF NOT EXISTS answers_table(id SERIAL PRIMARY KEY, questionId SERIAL, answer TEXT NOT NULL, status BOOLEAN, userId UUID, username TEXT NOT NULL, upvotes INT, downvotes INT)')
//Table to store all comments
const p5 = Pool.query('CREATE TABLE IF NOT EXISTS comments_table(id SERIAL PRIMARY KEY, answerid SERIAL, userid TEXT NOT NULL, username TEXT NOT NULL, comment TEXT NOT NULL)')


//resolve all promise returned
Promise.all([p1, p2, p3, p4, p5])
.then(result => {
    console.log('All tables created')
})
.catch(error => {console.log(error)})


module.exports = app