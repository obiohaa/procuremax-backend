const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: 'config/DBconfig.env'})

const auth = (req, res, next) => {
   // const token = req.headers
   const token = req.cookies.tokencookie;
    if(!token){  
        return res.status(500).json({message: 'Session expired, please logIn'})  }
    try{
        const decoded = jwt.verify(token, process.env.SECRET)
        req.email = decoded.email
        req.id = decoded._id
        return next()
    } catch(e){
        next(e)
    }
}

module.exports = auth;