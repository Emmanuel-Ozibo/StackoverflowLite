const router = require('express').Router()

const {usersController} = require('../controller')

router.post('/signup', usersController.registerUser)
router.post('/login', usersController.loginUser)

module.exports = router