const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const {createTransport} = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const port = 3000;
require('dotenv').config();



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

exports.viewForgotPassword = (req,res)=>{
    res.sendFile(path.join(__dirname,'../..','views','forgotPassword.html'));
}



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

            const createUserTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
                id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                product VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                expense DOUBLE(10,2) NOT NULL,
                \`description\` TEXT NOT NULL,
                leaderboard_id INT NOT NULL,
                FOREIGN KEY (leaderboard_id) REFERENCES Leaderboard(id) ON DELETE CASCADE,
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
                  
                  const query = 'SELECT Premium FROM User WHERE Email = ?'
                  pool.execute(query,[email],(err,result)=>{
                    if(err){
                    console.log(err)
                    }else{
                    if(result[0].Premium===0){
                        res.sendFile(path.join(__dirname, '../..', 'views', 'home.html'));
                    }else if(result[0].Premium===1){
                        res.sendFile(path.join(__dirname, '../..', 'views', 'premiumHome.html'));
                    }
                    }
                 })
              });
          });
      }
    }

   
   
    

  
exports.resetPasswordMail  = (req, res) => {

    const email = req.body.email
    const password = process.env.SMTP_KEY

    var resetToken = uuidv4();
   
    const resetLink = `http://localhost:${port}/reset-password/${resetToken}`;

    const multiLineText = `

    Greetings,

    Oops! It seems like you've misplaced your Expensy wand and can't access your treasure trove of financial wizardry. No worries, we've got the magic spell to get you back on track!

    Here's your spellbinding path to regain control:

    🔑 Click ${resetLink} to unlock the portal to password reset magic.

    🪄 Wave your wand and conjure up a brand new spellbinding password.

    ✨ Presto chango! You're back in full control of your financial realm. Remember, this password is as secret as your Hogwarts acceptance letter.

    If you suspect dark forces at play and didn't trigger this enchantment, just ignore this owl's message and continue your magical journey.

    Magically yours,
    The Enchanted Expensy Team 🧙‍♂️🔮
    

    This email is protected by © Expensy`

    const query1 = 'SELECT * from User where Email = ?'
           
    pool.execute(query1, [email],(err,results)=>{
                
        if(err){
                    
            console.log(err);
            return
        }
    
        if (results.length === 0) {
            return res.send(`
            <script>
            alert('Please check your email address and try again');
            window.history.back();
            </script>
           `);

    }else{

      
    const transporter = createTransport({
        host : 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: 'chandrachudsahi@gmail.com',
            pass: password
        },
    });

    const mailOptions = {
        from: "noreply@expensy.com",
        to : email,
        subject : ' 🎩 Magic at Work: Reviving Your Expensy Powers!',
        text: multiLineText
    }

    transporter.sendMail(mailOptions, (error,info)=>{
        if(error){
            console.log(error);
        }else{

        const query = `INSERT INTO Forgot_Password (email, is_active, uuid) VALUES (?, ?, ?)`;
        
        pool.execute(query, [email, true, resetToken], (err, result) => {
            if (err) {
            console.log('Error inserting data into Forgot_Password', err);
            return;
            }
            console.log('Data inserted into Forgot_Password successfully');
        })
        
            console.log('Email sent:' + info.response);
        
            const alertScript = `
            <script>
                alert('Email with link to reset your password has been sent. Please check your inbox.');
                window.location.href = '/signup'; 
            </script>
            `;

            res.send(alertScript);
        }
        })

    }
        })


    }




exports.resetPassword = (req,res) => {

    const password = req.body.password;
    const token = req.body.token;

    const query1 = 'SELECT email from Forgot_Password where uuid = ? AND is_active = ?'
    pool.execute(query1,[token,true], (err,result)=>{
        if(err){
            console.log(err)
            return
        }

        if (result.length > 0) {
            const email = result[0].email;
        

    const saltRounds = 10;

            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.log('Error while hashing password', err);
                    return;
                }
                const newHashedPassword = hashedPassword
            

    const query2 = 'UPDATE User SET Password = ? WHERE Email = ?'
    pool.execute(query2,[newHashedPassword,email], (err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Updated password successfully')
            const query3 = 'UPDATE Forgot_Password SET is_active = ? WHERE uuid = ?'
            pool.execute(query3,[false,token],(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log('Updated request status successfully');
                    return res.send(`
                      <script>
                          alert('Your password has been updated successfully');
                          window.history.back();
                      </script>
                  `);
                }
            })
        }
    })
})
}else{
    console.log('token not found');
}

})
}
