const mysql = require('mysql2');
const path = require('path');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "0542@Cool",
  database: "Expensy"
});

exports.viewLeaderBoard = (req,res) =>{
    res.sendFile(path.join(__dirname, '../..', 'views', 'leaderboard.html'));
}