const express = require('express');
const router = express.Router();
const {
    getAllCars,
    getSingleCar,
    createCar,
    updateCar,
    deleteCar,
    assignDriverToCar
} = require('../controllers/carsController');

// CRUD routes
router.get('/', getAllCars); // Get all cars
router.get('/:id', getSingleCar); // Get a single car by ID
router.post('/', createCar); // Insert a new car
router.put('/:id', updateCar); // Update an existing car
router.delete('/:id', deleteCar); // Delete a car
router.post('/assign-driver', assignDriverToCar); 


module.exports = router;
