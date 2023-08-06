const leaderboardTable = document.getElementById('leaderboard'); 

fetch('/LeaderboardData')
  .then((response) => response.json())
  .then((data) => {
    data.forEach((entry) => {
      const row = leaderboardTable.insertRow();
      row.insertCell(0).textContent = entry.rank;
      row.insertCell(1).textContent = entry.name;
      row.insertCell(2).textContent = entry.totalExpense;

      const ratingCell = row.insertCell(3);
      const rating = calculateRating(entry.totalExpense);
      ratingCell.innerHTML = generateStars(rating);
    });
  })
  .catch((error) => {
    console.error('Error fetching leaderboard data', error);
  });

  
  function calculateRating(totalExpense) {
    if (totalExpense >= 10000) {
      return 6; 
    } else if (totalExpense >= 8000) {
      return 5; 
    }else if (totalExpense >= 6000) {
      return 4;
    }else if (totalExpense >= 4000) {
      return 3; 
    }else if (totalExpense >= 2000) {
      return 2;
    }else{
      return 1;
    }
  }

  function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '<span class="rating-star"></span>'; 
    }
    return stars;
  }
  
 