const mysql = require('mysql2');
const path = require('path');
const Razorpay = require('razorpay');
require('dotenv').config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });


const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "0542@Cool",
  database: "Expensy"
});


exports.checkOut = (req,res)=>{

var options = {
  amount: Number(req.body.amount*100),  
  currency: "INR"
};

instance.orders.create(options, (err, order) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    res.json({ 
        success: true,
        order
     });
  });
}



exports.paymentVerification = (req, res) => {

  try {
  console.log(req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const {validatePaymentVerification} = require('../../node_modules/razorpay/dist/utils/razorpay-utils');
  const secret = process.env.RAZORPAY_SECRET_KEY;

    validatePaymentVerification(
      { "order_id": razorpay_order_id, "payment_id": razorpay_payment_id },
      razorpay_signature,secret);

    console.log('Payment verification successful:', req.body);

    return res.send(`
    <script>
      alert('Payment Successful. You are a Premium User.');
      window.history.back();
    </script>
  `);


  } catch (error) {
    console.error('Payment verification failed:', error);

    res.status(400).json({
      success: false,
      error: 'Payment verification failed',
    });
  }
};

    
       
     



