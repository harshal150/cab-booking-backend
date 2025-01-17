const db = require('../config/db');


exports.createTransaction = async (req, res) => {
    try {
        const { user_id, booking_id, transaction_id, amount, payment_method, status } = req.body;

        // Insert the transaction into the transactions table
        const [result] = await db.query(
            `INSERT INTO transactions (user_id, booking_id, transaction_id, transaction_date, amount, payment_method, status)
             VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
            [user_id, booking_id, transaction_id, amount, payment_method, status]
        );

        res.status(201).json({ message: 'Transaction recorded', transactionId: result.insertId });
    } catch (error) {
        console.error('Error recording transaction:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllTransactions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                t.id AS id,
                t.transaction_id,          -- Include transaction_id
                t.user_id,
                u.user_name,
                t.booking_id,
                b.status AS booking_status,
                t.transaction_date,
                t.amount,
                t.payment_method,
                t.status AS transaction_status
            FROM 
                transactions t
            LEFT JOIN 
                users u ON t.user_id = u.id
            LEFT JOIN 
                bookings b ON t.booking_id = b.id
        `);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                t.id AS id,
                t.transaction_id,          -- Include transaction_id
                t.user_id,
                u.user_name,
                t.booking_id,
                b.status AS booking_status,
                t.transaction_date,
                t.amount,
                t.payment_method,
                t.status AS transaction_status
            FROM 
                transactions t
            LEFT JOIN 
                users u ON t.user_id = u.id
            LEFT JOIN 
                bookings b ON t.booking_id = b.id
            WHERE 
                t.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, payment_method, status } = req.body;

        const [result] = await db.query(
            `UPDATE transactions
             SET amount = ?, payment_method = ?, status = ?, transaction_date = NOW()
             WHERE id = ?`,
            [amount, payment_method, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: error.message });
    }
};
