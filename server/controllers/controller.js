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
    const formAction = req.body.formAction;

    if(formAction==='signUp'){
    
    if(!name || !email || !password){
        return res.send(`
        <script>
            alert('Please check all the fields');
            window.history.back();
        </script>
    `);
    };

    pool.execute('SELECT COUNT(*) AS count FROM User WHERE Email = ?',[email],(err,results) =>{
        if(err){
            console.log('Error querying database',err);
        }

        const userExists = results[0].count>0;
        if(userExists){
            return res.send(`
            <script>
                alert('User already exists.Please login.');
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
    
    };
    
    if(formAction === 'signIn'){

        if(!email || !password){
            return res.send(`
            <script>
                alert('Please check all the fields');
                window.history.back();
            </script>
        `);
        };

        const query1 = 'SELECT * from User where Email = ?'
        pool.execute(query1, [email],(err,results)=>{
            if(err){
                
                console.log(err);
                return
            }

            if (results.length === 0) {
                return res.send(`
                  <script>
                    alert('Invalid user');
                    window.history.back();
                  </script>
                `);
              }
          
            
            if(password !== results[0].Password){
                return res.send(`
                <script>
                    alert('Check your password');
                    window.history.back();
                </script>
            `);
            }

            console.log('Login Successful');
            res.sendFile(path.join(__dirname,'../..','views','home.html'));
        });

    };
}

