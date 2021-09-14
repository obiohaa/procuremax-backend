const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '../config/DBconfig.js'})
const userReg = require('../model/reg')
const baseError = require('../middleware/errorHandler/baseCustomError')



//Register User
const register = async (req, res, next) => {
    //get login details from req.body, confirm if user exist...
    const {firstName, lastName, email, phoneNumber, password, roles} = req.body;
    try{
      let userRegistered = await userReg.findOne({email})
      if(userRegistered){
          throw new baseError('User already exist, please logIn', 404)
      }
      //...if no then hash user password then save user registration
      userRegistered = new userReg({
        firstName,
        lastName, 
        email,
        phoneNumber,
        password,
        roles
      })
      const SALT_VALUE = 10;
      bcrypt.genSalt(SALT_VALUE, function(err, salt){
          bcrypt.hash(password, salt, function(err, hash){
            userRegistered.password = hash;
            userRegistered.save().then(() => res.status(200).json({message: 'Registration done, please login'}))

          })
      })
    } catch(e){
        next(e)
    }
}

//Login in uer nd create TOKEN
const login = async (req, res, next) => {
    
  const {email, password, roles} = req.body
  try{
      let loggedIn = await userReg.findOne({email});
      if(!loggedIn){
        throw new baseError('Email not found, please confirm your email', 404)
      } 

      if(loggedIn.roles !== roles) {
        throw new baseError('Please confirm your role again', 404)
    }

      const isMatch = await bcrypt.compare(password, loggedIn.password)
      if(!isMatch){
        throw new baseError('Incorrect password', 400)
      }

      const payload = {
              id: loggedIn._id,
              email: loggedIn.email
      };

      jwt.sign(payload, process.env.SECRET, (err, token) => {
         if(!token){
            throw new baseError('Token not generated, please logIn again', 500)
         }
          return res.cookie('tokencookie', token, {maxAge:900000, httpOnly:true}).status(200).json({token})
          //secure:true forbidden without https
      })
  } catch(e) {
      next(e)
  }
}


//Get all logged in User
const getAll = async (req, res, next) =>{
    
    try{
        const allData = await userReg.find({})
        if(allData){
            throw new baseError('Unknown user', 500)
        } return res.json({message: 'All data was delivered successfully', data: getUser})
    } catch(e) {
        next(e)
    }
}


//Get one login user by Id
const getOne = async(req, res, next) => {
    try{
        const getUser = await userReg.findOne({_id: req.params.getUser})
        if(!getUser){
            throw new baseError('Unknown user', 500)
        } return res.json({message: 'All data was delivered successfully', data: getUser})
    } catch(e) {
        next(e)
    }
}

//delete one login user by Id
const removeOne = async(req, res, next) =>{
    try{
        const deleteOne = await userReg.deleteOne({_id: req.params.delUser})
        if(!deleteOne){
            throw new baseError('Unknown user', 500)
        } return res.json({message: 'User record deleted'})
    } catch(e){
        next(e)
    }
}

//logout signed In user
const logOutOne = (req, res, next) => {
    try{
         res.clearCookie('tokencookie').status(200).json({message: 'Successfully logged out'})
    } catch(e){
        next(e)
    }
}


//Update user by Id
const updateOne = async(req, res, next) => {
    const {firstName, lastName, email, phoneNumber, password, roles} = req.body;
    try{
        const updateUserDB = await userReg.findOne({_id: req.params.updateUser})
        if(!updateUserDB){
            throw new baseError('User does not exit', 404)
        } 
        const query = {
            _id: req.params.updateUser,
          };
          const userObj = {
            $set: {
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                roles
            },
          };
        const findUpdate = await userReg.findOneAndUpdate(query, userObj, {new:true})
        if(findUpdate){
            return res.json({message: 'record might be added', data: findUpdate})
        }
    } catch(e){
        next(e)
    }
}
module.exports = {register, login, getAll, getOne, removeOne, logOutOne, updateOne}