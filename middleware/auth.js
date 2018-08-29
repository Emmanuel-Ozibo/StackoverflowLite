const config = require('config')
const jwt = require('jsonwebtoken')


exports.authWare = (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send('Operation failed, no token provided')
    try{
        const decode = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decode
        next()
    }catch(ex){
        res.status(400).send('failed, invalid token')
    }
}