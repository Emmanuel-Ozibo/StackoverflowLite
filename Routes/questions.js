const router = require('express').Router()
const{postQuestionsController, getQuestionsController} = require('../controller')

router.post('/', postQuestionsController.insertQuestion)
router.get('/', getQuestionsController.getQuestion)

module.exports = router