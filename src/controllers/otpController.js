
const db = require('../config/db');

const axios = require('axios');

// In-memory storage for OTPs (or you can use a database like Redis)
const otpStore = {};

exports.sendOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ message: 'Mobile number is required' });
        }

        // Generate a 6-digit random OTP
        const randomOtp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

console.log(randomOtp)
        // Save OTP to in-memory store with an expiration (5 minutes)
        otpStore[mobileNumber] = { otp: randomOtp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes

        // Send OTP via the SMS API
        const smsApiUrl = `http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY=afd0cabb62aac3aa6d1cf427dfb12af1&message=OTP%20to%20login%20JSCL%20Mobile%20App%20is%20${randomOtp}&senderId=JSICCC&routeId=1&mobileNos=${mobileNumber}&smsContentType=english`;

        await axios.get(smsApiUrl);

        return res.status(200).json({ message: 'OTP sent successfully', mobileNumber });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};




exports.verifyOtp = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({ message: 'Mobile number and OTP are required' });
        }

        // Check if OTP exists and is valid
        const storedOtp = otpStore[mobileNumber];
        if (!storedOtp) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        // Check if OTP is expired
        if (storedOtp.expiresAt < Date.now()) {
            delete otpStore[mobileNumber]; // Remove expired OTP
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Check if OTP matches
        if (storedOtp.otp !== parseInt(otp, 10)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, remove it from store
        delete otpStore[mobileNumber];

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
};
