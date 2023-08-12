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


   const premium = document.getElementById('btn3');

   premium.addEventListener('click', () => {
    initiateRazorpayPayment();
  });



const initiateRazorpayPayment = () => { 

fetch('/getkey')
.then(response => response.json())
.then(keyData => {
  fetch('/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 350,
    }),
  })
  .then(response => response.json())
  .then(orderData => {
    

    const options = {
      key: keyData.key, 
      amount: orderData.order.amount, 
      currency: "INR",
      name: "Expensy",
      description: "Premium Membership Subscription",
      image: "logo.jpg",
      order_id: orderData.order.id, 
      callback_url: "http://localhost:3000/paymentverification",
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000"
      },
      notes: {
        "address": "Razorpay Corporate Office"
      },
      theme: {
        "color": "#813D9C"
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  })
  .catch(error => {
    console.error('Error fetching order details:', error);
  });
})
.catch(error => {
  console.error('Error fetching Razorpay key:', error);
});

}  







    