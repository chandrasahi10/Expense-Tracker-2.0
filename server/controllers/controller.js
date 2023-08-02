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

exports.checkUser = (req,res) => {
    
};

exports.doSignUp = (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    pool.execute('SELECT COUNT(*) AS count FROM User WHERE Email = ?',[email],(err,results) =>{
        if(err){
            console.log('Error querying database',err);
        }

        const userExists = results[0].count>0;
        if(userExists){
            return res.send(`
            <script>
                alert('User already exists');
                window.history.back();
            </script>
        `);

        }else{

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
    });
}

