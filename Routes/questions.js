const router = require('express').Router()
const authMiddleWare = require('../middleware/auth')

//Controller
const{postQuestionsController,
     getQuestionsController, 
     answersController}
      = require('../controller')


//Router
router.post('/',authMiddleWare.authWare,postQuestionsController.insertQuestion)
router.get('/',authMiddleWare.authWare,getQuestionsController.getQuestions)
router.get('/:questionId',authMiddleWare.authWare,getQuestionsController.setSingleQuestion)
router.delete('/:questionId',authMiddleWare.authWare,getQuestionsController.deleteQuestion)
router.post('/:questionId/answers',authMiddleWare.authWare,answersController.postAnswer)
router.put('/:questionId/answers/answerId',authMiddleWare.authWare,answersController.updateAnswer)


module.exports = router