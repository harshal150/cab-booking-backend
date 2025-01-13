const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/usersController');

// CRUD routes
router.get('/', getAllUsers);       // Fetch all users
router.get('/:id', getUserById);   // Fetch a single user by ID
router.post('/', createUser);      // Add a new user
router.put('/:id', updateUser);    // Update user info
router.delete('/:id', deleteUser); // Delete a user

module.exports = router;
