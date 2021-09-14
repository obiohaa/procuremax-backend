const {model, Schema} = require('mongoose');

const regSchema = new Schema({
    firstName: {
        type:String,
        required: [true, 'first name is required']
    },
    lastName: {
        type:String,
        required: [true, 'last name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    phoneNumber: {
        type: Number,
        required: [true, 'phone number required']
    },
    password: {
        type: String,
        required: [true, 'password required'],
        min: [6, 'password must be greater than {value}']
    },
    
    roles: {
        type: String,
        required: [true, 'please select  role']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('userReg', regSchema)