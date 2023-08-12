const path = require('path');
const mysql = require('mysql2');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION
});

const s3 = new AWS.S3();

const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "0542@Cool",
    database: "Expensy"

});

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.email) {
      next();
    } else {
      res.redirect('/signup'); 
    }
  };


exports.viewHome = (req,res) =>{
  const email = req.session.email;

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
}

exports.viewExpense = (req,res) =>{

    const email = req.session.email;

    const query = 'SELECT Premium FROM User WHERE Email = ?'
    pool.execute(query,[email],(err,result)=>{
      if(err){
        console.log(err)
      }else{
        if(result[0].Premium===0){
          res.sendFile(path.join(__dirname, '../..', 'views', 'expenseTable.html'));
        }else if(result[0].Premium===1){
          res.sendFile(path.join(__dirname, '../..', 'views', 'premiumExpenseTable.html'));
        }
      }
    })
    
}


exports.addData = (req, res) => {
  
  const email = req.session.email;
  const product = req.body.product;
  const category = req.body.category;
  const expense = parseFloat(req.body.expense);
  const description = req.body.description;

  const sanitizeEmailForTableName = (email) => {
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
    return `${sanitizedEmail}_data`;
  };

  const tableName = sanitizeEmailForTableName(email);

  const query = `SELECT Name from User where Email = ?`
  pool.execute(query, [email], (err, result) => {
    if (err) {
      console.log('Error selecting name', err);
      return;
    }
    console.log('Name selected successfully');
  
   const name = result[0].Name;


  const query1 = `INSERT INTO Leaderboard (Email, Expense, Name) VALUES (?, ?, ?)`;
  pool.execute(query1, [email, expense,name], (err, result) => {
    if (err) {
      console.log('Error inserting data into Leaderboard', err);
      return;
    }
    console.log('Data inserted into Leaderboard successfully');

    const leaderboardId = result.insertId;

    const query2 = `INSERT INTO ${tableName} (product, category, expense, description, leaderboard_id) VALUES (?, ?, ?, ?, ?)`;
    pool.execute(
      query2,
      [product, category, expense, description, leaderboardId],
      (err, result) => {
        if (err) {
          console.log(`Error inserting data into ${tableName}`, err);
          return;
        }
        console.log(`Data inserted into ${tableName} successfully`);
        return res.send(`
          <script>
            alert('Your expense has been added successfully');
            window.history.back();
          </script>
        `);
      }
    );
  });
});
};


exports.getExpenses = (req, res) => {

    const sanitizeEmailForTableName = (email) => {
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitizedEmail}_data`;
    };

    const email = req.session.email;
    const tableName = sanitizeEmailForTableName(email);
    const query = `SELECT leaderboard_id,product,category,expense,description, DATE_FORMAT(created_at, '%Y-%m-%d') as date FROM ${tableName}`;
    
    pool.execute(query, (err, result) => {
      if (err) {
        console.log('Error fetching data', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Send the expenses data as a JSON response to the client
      return res.json(result);
    });
  };



  exports.getMonthlyExpenses = (req, res) => {

    const sanitizeEmailForTableName = (email) => {
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitizedEmail}_data`;
    };

    const email = req.session.email;
    const tableName = sanitizeEmailForTableName(email);
    const query = `SELECT leaderboard_id,product,category,expense,description, DATE_FORMAT(created_at, '%M') as month FROM ${tableName} ORDER BY MONTH(created_at)`;
    
    pool.execute(query, (err, result) => {
      if (err) {
        console.log('Error fetching data', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Send the expenses data as a JSON response to the client
      return res.json(result);
    });
  };



  exports.getYearlyExpenses = (req, res) => {

    const sanitizeEmailForTableName = (email) => {
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitizedEmail}_data`;
    };

    const email = req.session.email;
    const tableName = sanitizeEmailForTableName(email);
    const query = `SELECT leaderboard_id,product,category,expense,description, DATE_FORMAT(created_at, '%Y') as year FROM ${tableName} ORDER BY YEAR(created_at)`;
    
    pool.execute(query, (err, result) => {
      if (err) {
        console.log('Error fetching data', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Send the expenses data as a JSON response to the client
      return res.json(result);
    });
  };


  
  exports.deleteExpense = (req, res) => {

    const expenseId = req.params.id; 
    console.log(expenseId);
  
    const query = `DELETE FROM Leaderboard WHERE id = ?`;
  
    pool.execute(query, [expenseId], (err, result) => {
      if (err) {
        console.error('Error deleting expense:', err);
      }
  
      if (result.affectedRows === 1) {
        console.log('Expense deleted successfully');
        res.redirect('/expenses');
      } else {
        console.log('Expense not found' );
      }
    });
  };

  exports.awsHandle = (req, res) => {

    const sanitizeEmailForTableName = (email) => {
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
    return `${sanitizedEmail}_data`;
  };

  const email = req.session.email;
  const tableName = sanitizeEmailForTableName(email);
  const currentDate = new Date().toISOString();
    
    const query = `SELECT leaderboard_id,product,category,expense,description, DATE_FORMAT(created_at, '%Y-%m-%d') as date FROM ${tableName}`
    pool.execute(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching expenses' });
      }
  
      const expensesText = results.map(row => `${row.leaderboard_id},${row.product},${row.category},${row.expense},${row.description},${row.date}`).join('\n');

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${tableName}_${currentDate}.txt`,
        Body: expensesText
      };
  
      s3.upload(params, (s3Error, s3Data) => {
        if (s3Error) {
          return res.status(500).json({ error: 'Error uploading expenses to S3' });
        }
  
        const signedUrl = s3.getSignedUrl('getObject', {
          Bucket:  process.env.BUCKET_NAME,
          Key: `${tableName}_${currentDate}.txt`,
          Expires: 3600 
        });
  
        return res.json({ downloadUrl: signedUrl });
      });
    });
  };
  