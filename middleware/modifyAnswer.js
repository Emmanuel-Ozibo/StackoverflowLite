import config from "config"
import jwt from "jsonwebtoken"

exports.modifyAnswer = (req, res, next) =>{
    const token = req.header('x-auth-token')
    //chack if there is a token 
    if(!token) return res.status(401).send('Access denied!!, no token provided.')

    try{
        //decode the token to get the user object 
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'))
        req.userDetails = decodedPayload
        console.log(`payload: ${decodedPayload}, \n userDetails: ${req.userDetails}`)
        next()
    }catch(ex){
        res.status(400).send('invalid token provided..')
    }
}