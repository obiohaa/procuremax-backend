const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: 'config/DBconfig.env'})
const express = require('express');
const DBase = process.env.DB;


const DBConnect = mongoose.connect(DBase, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log('DB connected well')).catch((err)=> console.log(err));

module.exports = DBConnect;