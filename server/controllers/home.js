const path = require('path');
const mysql = require('mysql2');

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
    res.sendFile(path.join(__dirname, '../..', 'views', 'home.html'));
}

exports.viewExpense = (req,res) =>{
    res.sendFile(path.join(__dirname, '../..', 'views', 'expenseTable.html'));
}

exports.addData = (req, res) =>{
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

    const query  = `INSERT INTO ${tableName} (product, category, expense, description) VALUES (?,?,?,?)`;
    pool.execute(query, [product,category,expense,description], (err, result) => {
        if (err) {
            console.log('Error inserting data', err);
            return;
        }
        console.log('Data inserted successfully');
        return res.send(`
        <script>
            alert('Your expense has been added successfully.');
            window.history.back();
        </script>
        `);
        
    });
}

exports.getExpenses = (req, res) => {

    const sanitizeEmailForTableName = (email) => {
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitizedEmail}_data`;
    };

    const email = req.session.email;
    const tableName = sanitizeEmailForTableName(email);
    const query = `SELECT id,product,category,expense,description FROM ${tableName}`;
    
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

    const sanitizeEmailForTableName = (email) => {
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitizedEmail}_data`;
    };

    const expenseId = req.params.id; 
  
    const email = req.session.email; 
    const tableName = sanitizeEmailForTableName(email); 
  
    const query = `DELETE FROM ${tableName} WHERE id = ?`;
  
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