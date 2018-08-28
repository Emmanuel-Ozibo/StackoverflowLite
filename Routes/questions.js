const router = require('express').Router()


//Controller
const{postQuestionsController,
     getQuestionsController, 
     answersController}
      = require('../controller')


//Router
router.post('/', postQuestionsController.insertQuestion)
router.get('/', getQuestionsController.getQuestions)
router.post('/:questionId/answers', answersController.postAnswer)
router.get('/:questionId', getQuestionsController.setSingleQuestion)


module.exports = router