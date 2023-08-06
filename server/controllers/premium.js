const mysql = require('mysql2');
const path = require('path');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "0542@Cool",
  database: "Expensy"
});

exports.getLeaderBoardData = (req, res) => {
  
  const query = `SELECT Name, SUM(Expense) AS totalExpense FROM Leaderboard GROUP BY Name ORDER BY totalExpense DESC`;

  pool.execute(query, (err, result) => {
    if (err) {
      console.log('Error fetching leader-Board data', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const leaderBoardData = result.map((row, index) => ({
      rank: index + 1,
      name: row.Name,
      totalExpense: row.totalExpense,
    }));

    res.json(leaderBoardData);
  });
};


exports.viewLeaderBoard = (req,res) =>{
    res.sendFile(path.join(__dirname, '../..', 'views', 'leaderboard.html'));
}