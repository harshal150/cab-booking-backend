const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
} = require('../controllers/bookingsController');

// CRUD routes
router.get('/', getAllBookings);       // Fetch all bookings
router.get('/:id', getBookingById);   // Fetch a single booking by ID
router.post('/', createBooking);      // Add a new booking
router.put('/:id', updateBooking);    // Update booking info
router.delete('/:id', deleteBooking); // Delete a booking

module.exports = router;
