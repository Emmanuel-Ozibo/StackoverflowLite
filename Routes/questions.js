const router = require('express').Router()
const questionsController = require('../controller/questionsController')


insertQuestionRouter = router.post('/', questionsController.insertQuestion)

module.exports = insertQuestionRouter