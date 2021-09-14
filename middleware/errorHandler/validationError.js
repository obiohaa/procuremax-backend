const {validationResult} = require('express-validator')

//middleware Login/Reg validation
function validationError (req, res, next) {
    const loginError = validationResult(req);
    if(!loginError.isEmpty()){
      return res.status(400).json({
          error: loginError.array(),
          message: 'something went wrong with your login details',
          statusCode: '400',
          success: 'false'
      })
    }
   next()
}

module.exports = {validationError}