const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    updateRandomId,
    getBookingByRandomId,
    updateBookingByRandomId
} = require('../controllers/bookingsController');

// CRUD routes
router.get('/', getAllBookings);       // Fetch all bookings
router.get('/:id', getBookingById);   // Fetch a single booking by ID
router.post('/', createBooking);      // Add a new booking
router.put('/update-booking/:randomId', updateBooking);    // Update booking info
router.put('/update/:id', updateBookingStatus);    // Update booking info
router.delete('/:id', deleteBooking); // Delete a booking
router.put('/random-id/:id', updateRandomId);
router.get('/by-random-id/:randomId',getBookingByRandomId);
router.put('/by-random-id/:randomId',updateBookingByRandomId);



module.exports = router;
