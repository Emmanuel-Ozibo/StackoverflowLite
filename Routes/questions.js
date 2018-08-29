const router = require('express').Router()


//Controller
const{postQuestionsController,
     getQuestionsController, 
     answersController}
      = require('../controller')


//Router
router.post('/', postQuestionsController.insertQuestion)
router.get('/', getQuestionsController.getQuestions)
router.get('/:questionId', getQuestionsController.setSingleQuestion)
router.delete('/:questionId', getQuestionsController.deleteQuestion)
router.post('/:questionId/answers', answersController.postAnswer)
router.put('/:questionId/answers/answerId', answersController.updateAnswer)


module.exports = router