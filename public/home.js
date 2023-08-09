const premium = document.getElementById('btn3');

premium.addEventListener('click', () => {
  initiateRazorpayPayment()
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


 

  









