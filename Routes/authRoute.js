const router = require('express').Router()
const {usersController} = require('../controller')
const authMiddleWare = require('../middleware/auth')

router.post('/signup', usersController.registerUser)
router.post('/login', usersController.loginUser)
router.get('/user', authMiddleWare.authWare, usersController.getUser)

module.exports = router