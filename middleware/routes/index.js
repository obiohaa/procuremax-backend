const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const controller = require('../../control/index')
const auth = require('../auth/auth')
const {validationError} = require('../errorHandler/validationError')

process.on('unhandledRejection', function (err) {
    console.log(err.message);
  });

router.post(
    "/reg",
    [
        body('firstName').not().isEmpty().withMessage('First name is needed').trim().escape().toLowerCase(),
        body('lastName').not().isEmpty().withMessage('Last name is needed').trim().escape().toLowerCase(),
        body('email').not().isEmpty().isEmail().withMessage('Email is needed').trim().normalizeEmail().toLowerCase(),
        body('phoneNumber').not().isEmpty().isNumeric().withMessage('Phone number is needed').trim(),
        body('password').not().isEmpty().withMessage('Password is needed').trim().isLength({min:6}).withMessage('Password must be more than 6 characters'),
        body('conFirmPassword').not().isEmpty().withMessage('Password is needed').trim().isLength({min:6}).withMessage('Password must be more than 6 characters'),
        body('roles').not().isEmpty().withMessage('Please select role')
    ], validationError, controller.register)

router.post("/login", 
    [
        body('email').not().isEmpty().isEmail().withMessage('Email is needed').trim().normalizeEmail().toLowerCase(),
        body('password').not().isEmpty().withMessage('Password is needed').trim().isLength({min:6}).withMessage('Password must be more than 6 characters'),
        body('roles').not().isEmpty().withMessage('please select role')
    ], validationError, controller.login)

router.get('/logout', auth, controller.logOutOne)

router.get('/getAll', auth, controller.getAll)

router.get('/:getUser', auth, controller.getOne)

router.delete('/:delUser', auth, controller.removeOne)

router.put('/:updateUser', auth, controller.updateOne)






module.exports = router;