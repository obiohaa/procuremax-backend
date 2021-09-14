const express= require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const DBConnect = require('./config/DBconfig');
const dotenv = require('dotenv');
dotenv.config({Path: './config/DBconfig.env'});
const router = require('./middleware/routes/index');
const baseError = require('./middleware/errorHandler/baseCustomError')
const logger = require('./utility/util')
const app = express();

//PORT
const PORT = process.env.PORT || 4321;

//middle wares
// app.use(json())
// app.use(urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


//main routes
app.use('/api/procuremax', router)

//default route
app.get('/api', function(req, res){
    res.status(200).json({message: 'API working'});
});


//Wrong Route
app.all('*', (req, res, next) => {
    const err = new Error(`Please check the Url link or path ${req.path}!`);
    err.statusCode = 404;
    next(err)  //using the err so that the next middleware called is the error middleware
});

//base error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: err.message,
        stack: err.stack
    })
})

//listening PORT
app.listen(PORT, (err)=>{
    if(err) {
        throw new baseError(`Server not listening to port ${PORT}`)
    }
    logger.info(`app is alive at port ${PORT}`)
});