const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const router = express.Router();

router.post('/send', sendOtp);    // API to send OTP
router.post('/verify', verifyOtp); // API to verify OTP

module.exports = router;
