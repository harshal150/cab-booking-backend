const express = require('express');
const dotenv = require('dotenv');
const env = process.env.NODE_ENV;

const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/config/db'); // Import MySQL connection
const cron = require('node-cron');
const crypto = require("crypto");
const axios = require("axios");
const querystring = require("querystring"); // Add this line to fix the issue
const { createProxyMiddleware } = require('http-proxy-middleware');
const otpRoutes = require('./src/routes/otpRoutes');

dotenv.config({ path: `.env.${env} `});
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use('/sms', createProxyMiddleware({
//   target: 'http://msg.icloudsms.com', // Target SMS API URL
//   changeOrigin: true,                 // Modify the origin header to match the target
//   pathRewrite: { '^/sms': '/rest/services/sendSMS' } // Rewrite path for API compatibility
// }));


// Routes
app.use('/api/cars', require('./src/routes/carsRoutes')); // Add the cars route
app.use('/api/drivers', require('./src/routes/driversRoutes')); // Add drivers route
app.use('/api/bookings', require('./src/routes/bookingsRoutes')); // Add bookings route
app.use('/api/users', require('./src/routes/usersRoutes')); // Add users route
app.use('/api/unavailable', require('./src/routes/carsUnavailableRoutes')); // Add users route
app.use('/api/transactions', require('./src/routes/transactionRoutes'));
app.use('/api/otp', otpRoutes);
// Test MySQL connection
db.getConnection()
    .then(() => {
        console.log('Connected to MySQL database.');
    })
    .catch((err) => {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit the app if connection fails
    });

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date
      const [result] = await db.query(
        `DELETE FROM car_unavailable_dates WHERE unavailable_date < ?`,
        [today]
      );
  
      // Reset status to "available" for all cars not in the unavailable table
      await db.query(
        `UPDATE cars
         SET status = 'available'
         WHERE id NOT IN (SELECT car_id FROM car_unavailable_dates WHERE unavailable_date >= ?)`,
        [today]
      );
  
      console.log(`Reset car statuses and cleared old unavailable dates on ${today}.`);
    } catch (error) {
      console.error('Error resetting car statuses:', error.message);
    }
  });











  app.use(bodyParser.urlencoded({ extended: true }));


// app.use(
//   '/rest/services/sendSMS',
//   createProxyMiddleware({
//     target: 'http://msg.icloudsms.com',
//     changeOrigin: true,
//   })
// );
  



  // Payment gateway credentials
  const RouterDomain = "https://test.payplatter.in/Router/initiateTransaction"; // Payment gateway base URL
  const username = "MPANKA261"; // Replace with actual username
  const password = "[C@445aba30"; // Replace with actual password
  const merchant_code = "THE265"; // Replace with actual merchant code
  
// Authentication keys (provided by Router)
const privateKey = "Wq0F6lS7A5tIJU90"; // Replace with actual private key
const privateValue = "lo4syhqHnRjm4L0T"; // Replace with actual private value
  // Endpoint to generate payment URL
  
app.post("/generate-payment-url", (req, res) => {
  const { amount, cab_name, email, mobileno } = req.body;

  if (!amount || !cab_name || !email || !mobileno) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const txnId = `txn_${Date.now()}`;
    const successURL = "https://yourdomain.com/payment-success"; // Replace with a public domain
    const failURL = "https://yourdomain.com/payment-failure"; // Replace with a public domain

    const queryParams = querystring.stringify({
      mcode: "THE265",
      uname: "MPANKA261",
      psw: "[C@445aba30", // Ensure this is correct
      amount: parseFloat(amount).toFixed(2),
      mtxnId: txnId,
      pfname: cab_name,
      pmno: mobileno,
      pemail: email,
      surl: successURL,
      furl: failURL,
    });

    const paymentUrl = `https://test.payplatter.in/Router/initiateTransaction?${queryParams}`;
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("Error generating payment URL:", error);
    res.status(500).json({ message: "Failed to generate payment URL." });
  }
});
  
  
  // Endpoint to handle success callback from the payment gateway
  app.post("/payment-success", async (req, res) => {
    const { transactionId, bookingId, mobileNumber, userName, date, time, driverName, driverMobile } =
      req.body; // Get payment and booking details from the gateway or database
  console.log(req.body)
    try {
      // SMS to the User
      const userSmsMessage = `Dear ${userName}, Your cab booking is confirmed! Booking ID/Date/Time: ${bookingId} / ${date} ${time} Driver Name/Contact: ${driverName} - ${driverMobile} Jhansi Smart City - Larsen and Toubro Limited`;
  
      const userSmsUrl = `http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${encodeURIComponent(
        userSmsMessage
      )}&senderId=JSICCC&routeId=1&mobileNos=${mobileNumber}&smsContentType=english`;
  
      const userSmsResponse = await fetch(userSmsUrl, {
        method: "GET",
      });
  
      if (!userSmsResponse.ok) {
        throw new Error("Failed to send SMS to user");
      }
  
      console.log("User SMS sent successfully");
  
      // SMS to the Driver
      const driverSmsMessage = `Dear Driver, You have a new ride request! Booking ID: ${bookingId} Pickup Date/Time: ${date} ${time} Customer Name/Contact: ${userName} - ${mobileNumber} Jhansi Smart City - Larsen and Toubro Limited`;
  
      const driverSmsUrl = `http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=${encodeURIComponent(
        driverSmsMessage
      )}&senderId=JSICCC&routeId=1&mobileNos=${driverMobile}&smsContentType=english`;
  
      const driverSmsResponse = await fetch(driverSmsUrl, {
        method: "GET",
      });
  
      if (!driverSmsResponse.ok) {
        throw new Error("Failed to send SMS to driver");
      }
  
      console.log("Driver SMS sent successfully");
  
      res.status(200).json({ message: "Payment success and SMS sent." });
    } catch (error) {
      console.error("Error handling payment success:", error);
      res.status(500).json({ message: "Error processing payment success." });
    }
  });
  
  
  
  // Endpoint to handle failure callback from the payment gateway
  app.post("/payment-failure", (req, res) => {
    try {
      const { transactionId, amount, status } = req.body;
  
      console.log(
        `Payment Failed: Transaction ID - ${transactionId}, Amount - ${amount}, Status - ${status}`
      );
      res.status(400).json({ message: "Payment failed. Please try again." });
    } catch (error) {
      console.error("Error handling payment failure callback:", error);
      res.status(500).json({
        message: "Internal Server Error. Please try again later.",
      });
    }
  });