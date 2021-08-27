const {body, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '../config/DBconfig.js'})
const fid = require('../model/reg')

const register = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message: 'bad error'
        })
    }
    const {firstName, lastName, email, phoneNumber, password, conFirmPassword, roles} = req.body;
    console.log(conFirmPassword)
    try{
      let userLoggedIn = await fid.findOne({email})
      if(userLoggedIn){
          return res.status(400).json({
              msg: "User already exist"
          });
      }
      userLoggedIn = new fid({
        firstName,
        lastName, 
        email,
        phoneNumber,
        password,
        conFirmPassword,
        roles
      })

      const salt = await bcrypt.genSalt(10)
      userLoggedIn.password = await bcrypt.hash(password, salt)
      userLoggedIn.conFirmPassword = await bcrypt.hash(password, salt)
      await userLoggedIn.save();

      const payload = {
          user: {
              id: userLoggedIn.id
          }
      }
      jwt.sign(
          payload,
          process.env.SECRET, {expiresIn: 10000},
          (err, token)=>{
            if(err) throw err
            res.status(200).cookie('tokencookie', token, {maxAge:90000, httpOnly:true}).json({token})
          }
      )
    } catch(err){
        res.status(500).send("Error in saving")
        console.log(err)
    }
}
module.exports = {register}