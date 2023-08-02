const mysql = require('mysql2');
const path = require('path');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "0542@Cool",
    database: "Expensy"

});

exports.viewSignUp = (req,res)=>{
    res.sendFile(path.join(__dirname,'../..','views','signup.html'));
}

exports.doSignUp = (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const query = 'INSERT INTO User (Name, Email, Password) VALUES (?,?,?)'
    pool.execute(query, [name,email,password],(err,result)=>{
        if(err){
            console.log(err);
            return
        }
        console.log('data inserted successfully');
        res.sendFile(path.join(__dirname,'../..','views','home.html'));
    });
};