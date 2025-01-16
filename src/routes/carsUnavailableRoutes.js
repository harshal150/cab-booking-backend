const express = require('express');
const router = express.Router();
const {
   makeCarUnavailable ,
   resetCarAvailability
} = require('../controllers/carsUnavailableController');

router.post('/', makeCarUnavailable); // Mark a car as unavailable for a date
router.post('/reset-availability', resetCarAvailability); // Reset car availability for past dates


module.exports = router;
