const router = require('express').Router()
const authMiddleWare = require('../middleware/auth')
const modifyAnswerMiddleware = require('../middleware/modifyAnswer')

//Controller
const{postQuestionsController,
     getQuestionsController, 
     answersController}
      = require('../controller')



//Router
router.post('/',authMiddleWare.authWare,postQuestionsController.insertQuestion)//post a question
router.get('/',authMiddleWare.authWare,getQuestionsController.getQuestions)//get all questions
router.get('/:questionId',authMiddleWare.authWare,getQuestionsController.setSingleQuestion)//get a particular question
router.delete('/:questionId',authMiddleWare.authWare,getQuestionsController.deleteQuestion)//delete a question(only the person who posted it)
router.post('/:questionId/answers',authMiddleWare.authWare,answersController.postAnswer)//answer a question
//allow the modification of an answer(edit by the answer publisher or accept by the author)
router.put('/:questionId/answers/:answerId',authMiddleWare.authWare,modifyAnswerMiddleware.modifyAnswer,answersController.modifyAnswer)
router.get('/user/questions',authMiddleWare.authWare,getQuestionsController.getAllQuestionsAskByUser)//gets all questions asked by a user 

router.put('/:questionId/answers/:answerId/upvote', authMiddleWare.authWare, answersController.upvoteAnAnswer)//for upvoting an answer
router.put('/:questionId/answers/:answerId/downvote', authMiddleWare.authWare, answersController.downvoteAnswer)

module.exports = router