const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

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

    const sanitizeEmailForTableName = (email) => {
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitizedEmail}_data`;
    };

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
            const tableName = sanitizeEmailForTableName(email);

            const createUserTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}_data (
                id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                product VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                expense DOUBLE(10,2) NOT NULL,
                \`description\` TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )`;
           
            pool.execute(createUserTableQuery, (error, results) => {
                if (error) {
                    console.log('Unable to create table',error);
                }else{
                    console.log('Table created successfully for user');
                }
            });

            const saltRounds = 10;

            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.log('Error while hashing password', err);
                    return;
                }
            
                const query = 'INSERT INTO User (Name, Email, Password) VALUES (?,?,?)';
                pool.execute(query, [name, email, hashedPassword], (err, result) => {
                    if (err) {
                        console.log('Error inserting data', err);
                        return;
                    }
                    req.session.email = email;
                    console.log('Data inserted successfully');
                    res.sendFile(path.join(__dirname, '../..', 'views', 'home.html'));
                });
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
          
            
              const hashedPassword = results[0].Password;
              bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                  if (err) {
                      console.log('Error while comparing passwords', err);
                      return;
                  }
      
                  if (!isMatch) {
                      return res.send(`
                      <script>
                          alert('Check your password');
                          window.history.back();
                      </script>
                  `);
                  }
                  req.session.email = email;
                  console.log('Login Successful');
                  res.sendFile(path.join(__dirname, '../..', 'views', 'home.html'));
              });
          });
      }
    }

 
