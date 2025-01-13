const express = require('express');
const router = express.Router();
const {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
} = require('../controllers/driversController');

// CRUD routes
router.get('/', getAllDrivers);       // Fetch all drivers
router.get('/:id', getDriverById);   // Fetch a single driver by ID
router.post('/', createDriver);      // Add a new driver
router.put('/:id', updateDriver);    // Update driver info
router.delete('/:id', deleteDriver); // Delete a driver

module.exports = router;
