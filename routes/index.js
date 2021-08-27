const express = require('express')
const router = express.Router()
const {body, validationResult} = require('express-validator')
const controller = require('../control/index')


router.post(
    "/reg",
    [
        body('firstName').not().isEmpty().trim().escape(),
        body('lastName').not().isEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('phoneNumber').isNumeric(),
        body('password').isLength({min:6}),
        body('conFirmPassword').isLength({min:6}),
        body('roles').not().isEmpty().trim().escape()
    ], controller.register)

    module.exports = router;