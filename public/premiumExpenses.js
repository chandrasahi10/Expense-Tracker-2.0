    const downloadButton = document.getElementById('downloadButton');

    downloadButton.addEventListener('click', () => {
      fetch('/generate-expenses-file')
        .then(response => response.json())
        .then(data => {
          window.location.href = data.downloadUrl;
        })
        .catch(error => console.error('Error:', error));
    });





const allTableData = {
  'custom-table': [],
  'custom-table2': [],
  'custom-table3': []
};

function populateTable(tableClass, page) {
  const tableBody = document.querySelector(`.${tableClass} tbody`);
  tableBody.innerHTML = '';

  const expenses = allTableData[tableClass];
  const perPage = 2;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  for (let i = startIndex; i < endIndex && i < expenses.length; i++) {
    const expense = expenses[i];
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
  }
}

function updatePaginationButtons(currentPage, totalPages) {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const currentPageSpan = document.querySelector('.current-page');

  currentPageSpan.textContent = currentPage;

  if (currentPage === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (currentPage === totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

function paginateAllTables(page) {
  for (const tableClass in allTableData) {
    populateTable(tableClass, page);
  }
}

let currentPage = 1;

const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    paginateAllTables(currentPage);
    updatePaginationButtons(currentPage, Math.ceil(allTableData['custom-table'].length / 2));
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(allTableData['custom-table'].length / 2);
  if (currentPage < totalPages) {
    currentPage++;
    paginateAllTables(currentPage);
    updatePaginationButtons(currentPage, totalPages);
  }
});

fetch('/getExpenses')
  .then(response => response.json())
  .then(data => {
    allTableData['custom-table'] = data;
    return fetch('/monthly-expenses');
  })
  .then(response => response.json())
  .then(data => {
    allTableData['custom-table2'] = data;
    return fetch('/yearly-expenses');
  })
  .then(response => response.json())
  .then(data => {
    allTableData['custom-table3'] = data;
    paginateAllTables(currentPage);
    updatePaginationButtons(currentPage, Math.ceil(allTableData['custom-table'].length / 2));
  })
  .catch(error => console.error('Error fetching data:', error));

