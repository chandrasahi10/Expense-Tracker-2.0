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