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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const {validatePaymentVerification} = require('../../node_modules/razorpay/dist/utils/razorpay-utils');
  const secret = process.env.RAZORPAY_SECRET_KEY;
  const email = req.session.email

    validatePaymentVerification({ "order_id": razorpay_order_id, "payment_id": razorpay_payment_id },razorpay_signature,secret);

    if(validatePaymentVerification){

      const query1 = 'UPDATE User SET Premium = True Where Email = ?'
      pool.execute(query1,[email],(error,res)=>{
        if(error){
          console.log('Error Updating Membership');
        }else{
          console.log('Updated Membership Successfully');
        }
      })

      const query2 = 'INSERT INTO Payment (Payment_ID, Order_ID, Email) VALUES (?, ?, ?)'
      pool.execute(query2, [razorpay_payment_id, razorpay_order_id,email],(error,result)=>{
        if(error){
          console.log('Error updating payment info');
        }else{
          console.log('Payment info updated successfully');
        }
      });
      
      const alertScript = `
      <script>
        alert('Payment Successful. You are now a Premium User ! Please login again to continue.');
        window.location.href = '/signup'; 
      </script>
    `;

    res.send(alertScript);
      

    }else{
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed',
      });
    }

  } catch (error) {
    console.error('Payment verification failed:', error);
  }
};

    
       
     



