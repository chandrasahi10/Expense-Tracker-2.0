const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./server/router/routes');
const mysql = require('mysql2');
require('dotenv').config();

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')));

const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "0542@Cool",
    database: "Expensy"

});

app.use('/',routes);

app.listen(port);


