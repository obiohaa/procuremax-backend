const express = require('express')
const {model, Schema} = require('mongoose')

const loginSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password required'],
        min: [6, 'password must be greater than {value}']
    },
    roles: {
        type: String,
        required: [true, 'please select  role']
    }
}, {timestamp: true})

model.exports = model('userLogin', loginSchema)