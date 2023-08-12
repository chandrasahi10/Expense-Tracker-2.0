fetch('/getExpenses') 
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('.custom-table tbody');

      tableBody.innerHTML = '';

      data.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.leaderboard_id}</td>
          <td>${expense.product}</td>
          <td>${expense.category}</td>
          <td>${expense.expense}</td>
          <td>${expense.description}</td>
          <td>${expense.date}</td>

          <td class="text-center">
            <a href="/deleteExpense/${expense.leaderboard_id}" class="btn btn-sm btn-outline-danger btn-small"><i class="bi bi-person-x"></i> Delete</a>
          </td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching data:', error));



    fetch('/monthly-expenses') 
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('.custom-table2 tbody');

      tableBody.innerHTML = '';

      data.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.leaderboard_id}</td>
          <td>${expense.product}</td>
          <td>${expense.category}</td>
          <td>${expense.expense}</td>
          <td>${expense.description}</td>
          <td>${expense.month}</td>
          <td class="text-center">
            <a href="/deleteExpense/${expense.leaderboard_id}" class="btn btn-sm btn-outline-danger btn-small"><i class="bi bi-person-x"></i> Delete</a>
          </td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching data:', error));



    fetch('/yearly-expenses') 
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('.custom-table3 tbody');

      tableBody.innerHTML = '';

      data.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.leaderboard_id}</td>
          <td>${expense.product}</td>
          <td>${expense.category}</td>
          <td>${expense.expense}</td>
          <td>${expense.description}</td>
          <td>${expense.year}</td>
          <td class="text-center">
            <a href="/deleteExpense/${expense.leaderboard_id}" class="btn btn-sm btn-outline-danger btn-small"><i class="bi bi-person-x"></i> Delete</a>
          </td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching data:', error));









