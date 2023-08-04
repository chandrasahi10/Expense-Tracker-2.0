
  function renderTable(data) {
    const tableBody = document.querySelector('.custom-table tbody');
    // Clear any existing rows
    tableBody.innerHTML = '';

    // Loop through the data and create table rows and cells
    data.forEach(expense => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.id}</td>
        <td>${expense.product}</td>
        <td>${expense.category}</td>
        <td>${expense.expense}</td>
        <td>${expense.description}</td>
        <td class="text-center">
          <a href="#" class="btn btn-sm btn-outline-primary btn-small">
            <i class="bi bi-pencil"></i> Edit
          </a>
          <a href="#" class="btn btn-sm btn-outline-danger btn-small">
            <i class="bi bi-person-x"></i> Delete
          </a>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Use AJAX with XMLHttpRequest for form submission
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/addedData'); // Replace with your server endpoint for adding data
    xhr.onload = function () {
      if (xhr.status === 200) {
        const newData = JSON.parse(xhr.responseText);
        console.log(newData); // Check the received JSON data in the console
        // Call a function to update the table with the new data
        renderTable(newData);
        // Show an alert to inform the user
        alert('Your expense has been added successfully.');
        // Redirect to the previous page
        window.history.back();
      } else {
        console.error('Error adding data:', xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error('Error adding data:', xhr.statusText);
    };
    xhr.send(formData);
  });

