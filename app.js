const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./server/router/routes');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
require('dotenv').config();

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags: 'a'});

app.use(helmet());
app.use(morgan('combined',{stream: accessLogStream}));

app.use(cors());

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true


}));

const pool = mysql.createPool({
    connectionLimit: 100,
    host         : process.env.DB_HOST,
    user         : process.env.DB_USER,
    password     : process.env.DB_PASSWORD,
    database     : process.env.DB_NAME,

});

app.use('/',routes);

app.get('/getkey',(req,res)=>{
    res.status(200).json({key: process.env.RAZORPAY_ID_KEY});
});

app.listen(process.env.PORT||3000);


