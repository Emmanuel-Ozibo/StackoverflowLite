import espress from "express"
import { usersController } from "../controller";
import authMiddleWare from "../middleware/auth"
const router = espress.Router()

router.post('/signup', usersController.registerUser)
router.post('/login', usersController.loginUser)
router.get('/user', authMiddleWare.authWare, usersController.getUser)

module.exports = router