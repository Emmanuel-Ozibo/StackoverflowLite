const pool = require('../../database')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const _= require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config')


//query to register new user
const registerUserString = 'INSERT INTO users_table(username, email, password) VALUES($1, $2, $3) RETURNING*'

//get all users with a particular email
const getUserWithEmail = 'SELECT email FROM users_table WHERE email = $1'

//get all user detail
const getUserDataWithEmail = 'SELECT * FROM users_table WHERE email = $1'




exports.registerUser = async (req, res) => {
    //for request you send in user name and password in the body
    const user = {
        username: req.body.username,
        email: req.body.email, 
        password: req.body.password
    }

    //Validate user input(all fields are required)
    const schema = Joi.object().keys({
        username: Joi.string().min(3).max(50).required(), 
        email: Joi.string().min(3).max(250).required(), 
        password: Joi.string().min(5).max(400).required() 
    })

    Joi.validate(user, schema ,(err, value) => {
        if(err){
            res.status(400).send({status: 'error', message: `${err.details[0].message}`})
        }
    })

    //check if the user is already registered 
    pool.query(getUserWithEmail, [user.email])
    .then(result => {
        if(result.rowCount === 0){
            //user have not been registered
            bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                console.log(hash)
                user.password = hash

                pool.query(registerUserString, [`${user.username}`, `${user.email}`, `${user.password}`])
                .then(result => {
                    const userData = _.pick(result.rows[0], ['id', 'username', 'email'])
                    const token = jwt.sign(userData, config.get('jwtPrivateKey'))
                    res.header('x-auth-token', token).send({status: 'success', data: userData})
                })
                .catch(error => {
                    res.status(400).send({massage: 'There was an error registering users'})
                    console.log(error)
                })

            })
        })

        }else{
            res.status(400).send({status: 'error', message: 'user have been registered.'})
        }
    })
    .catch(error => {
        res.status(505).send('Something happened while getting the user')
    })

}




exports.loginUser = (req, res) =>{
    //get the user from the database
    const user = {
        email: req.body.email, 
        password: req.body.password
    }
    //validate the input
    const schema = Joi.object().keys({
        email: Joi.string().min(3).max(250).required(), 
        password: Joi.string().min(5).max(400).required() 
    })

    Joi.validate(user, schema, (err, value) => {
        if(err){
            res.status(400).send({status: 'error', message: 'invalid email or password'})
        }
    })
    pool.query(getUserDataWithEmail, [`${user.email}`])
    .then(result => {
        if(result.rowCount === 0){
            //no user found with that email
            res.status(400).send({status: 'error', message: 'user not registered.'})
        }else{
            const registeredUser = result.rows[0]
            console.log(`password: ${user.password}, encpt: ${registeredUser.password}, regUser: ${registeredUser}`)
            bcrypt.compare(user.password, registeredUser.password, (err, response) => {
                if(err){
                    console.log(`there was an error knowing the encryted message: ${err}`)
                }
                if(response){
                    const userData = _.pick(registeredUser, ['id', 'username', 'email'])
                    //create json web token here 
                    const token = jwt.sign(userData, config.get('jwtPrivateKey'))
                    res.header('x-auth-token', token).send({status: 'success', data: userData})
                }else{
                    res.status(400).send({status: 'error', message: 'Incorrect password.'})
                }
            })
        }
    })
    .catch(error => {
        res.status(505).send({status: 'error', message: 'server error'})
    })
}

exports.getUser =async (req, res) => {
    if(req.user === undefined){
        res.status(400).send('cant get a user')
    }else{
        const userData = _.pick(req.user, ['id','username', 'email'])
    
        res.send(userData)
    }
   
}