import express from "express"
import authMiddleWare from "../middleware/auth"
import modifyAnswerMiddleware from "../middleware/modifyAnswer"

import { postQuestionsController,
      getQuestionsController, 
      answersController, commentsController } from "../controller";

const router = express.Router()


//Routers
router.post('/',authMiddleWare.authWare,postQuestionsController.insertQuestion)//post a question
router.get('/',authMiddleWare.authWare,getQuestionsController.getQuestions)//get all questions
router.get('/:questionId',authMiddleWare.authWare,getQuestionsController.setSingleQuestion)//get a particular question
router.delete('/:questionId',authMiddleWare.authWare,getQuestionsController.deleteQuestion)//delete a question(only the person who posted it)
router.post('/:questionId/answers',authMiddleWare.authWare,answersController.postAnswer)//answer a question
//allow the modification of an answer(edit by the answer publisher or accept by the author)
router.put('/:questionId/answers/:answerId',authMiddleWare.authWare,modifyAnswerMiddleware.modifyAnswer,answersController.modifyAnswer)

router.get('/user/questions',authMiddleWare.authWare,getQuestionsController.getAllQuestionsAskByUser)//gets all questions asked by a user 
router.get('/user/answers', authMiddleWare.authWare, answersController.getAllAnswersGivingByAUser)

router.put('/:questionId/answers/:answerId/upvote', authMiddleWare.authWare, answersController.upvoteAnAnswer)//for upvoting an answer
router.put('/:questionId/answers/:answerId/downvote', authMiddleWare.authWare, answersController.downvoteAnswer)

router.post('/:questionId/answers/:answerId/comment', authMiddleWare.authWare, commentsController.insertComment)
router.get('/:questionId/answers/:answerId/comment', authMiddleWare.authWare, commentsController.getComments)




module.exports = router