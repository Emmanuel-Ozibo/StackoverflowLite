const postQuestionsController = require('./question/postQuestionsController')
const getQuestionsController = require('./question/getQuestionsController')
const answersController = require('./answer/answersController')
const usersController = require('./users/usersController')
const commentsController = require('./comment/commentsController')

module.exports = {postQuestionsController, getQuestionsController,answersController, usersController, commentsController}