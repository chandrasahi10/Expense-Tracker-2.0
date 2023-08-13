const mysql = require('mysql2');
const path = require('path');

const pool = mysql.createPool({
  connectionLimit: 100,
  host         : process.env.DB_HOST,
  user         : process.env.DB_USER,
  password     : process.env.DB_PASSWORD,
  database     : process.env.DB_NAME,

});

exports.getLeaderBoardData = (req, res) => {
  
  const query = `SELECT Email, Name, SUM(Expense) AS totalExpense FROM Leaderboard GROUP BY Email,Name ORDER BY totalExpense DESC`;

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