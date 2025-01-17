const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction
} = require('../controllers/transactionController');

// Transaction routes
router.post('/', createTransaction);          // Create a new transaction
router.get('/', getAllTransactions);          // Get all transactions
router.get('/:id', getTransactionById);       // Get transaction by ID
router.put('/:id', updateTransaction);        // Update a transaction (optional)

module.exports = router;
