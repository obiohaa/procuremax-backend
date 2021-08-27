const express= require('express');
const mongoose = require('mongoose');
const { urlencoded, json } = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const DBConnect = require('./config/DBconfig');
const dotenv = require('dotenv');
dotenv.config({Path: './config/DBconfig.env'});
const app = express();
const router = require('./routes/index');

//PORT
const PORT = process.env.PORT || 4321;

//middle wares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(json())
// app.use(urlencoded({extended: true}))


//main routes
app.use('/api/procuremax', router)

//default route
app.get('/api', function(req, res){
    res.status(200).json({message: 'API working'});
});

//listening PORT
app.listen(PORT, (err)=>{
    if(err) {
        console.log('an error happened')
    }
    console.log(`app is alive at port ${PORT}`);
});