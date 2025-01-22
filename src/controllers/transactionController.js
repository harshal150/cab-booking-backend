const db = require('../config/db');


exports.createTransaction = async (req, res) => {
    const { created_date, user_id, booking_id, ride_id, start_reading } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO transactions (
                created_date, user_id, booking_id, ride_id, start_reading, status
             ) VALUES (?, ?, ?, ?, ?, ?)`,
            [created_date, user_id, booking_id, ride_id, start_reading, "Pending"]
        );

        res.status(201).json({
            message: "Transaction created successfully",
            transactionId: result.insertId,
        });
    } catch (error) {
        console.error("Error creating transaction:", error.message);
        res.status(500).json({ error: error.message });
    }
};





exports.getAllTransactions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                t.id,
                t.created_date,
                t.user_id,
                u.user_name,
                t.booking_id,
                b.status AS booking_status,
                t.ride_id,
                t.start_reading,
                t.end_reading,
                t.reading_difference,
                t.rate,
                t.calculated_amount,
                t.transaction_id,
                t.status,
                t.amount,
                t.payment_method,
                t.receipt_number,
                t.created_at,
                t.updated_at
            FROM 
                transactions t
            LEFT JOIN 
                users u ON t.user_id = u.id
            LEFT JOIN 
                bookings b ON t.booking_id = b.id
        `);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching transactions:", error.message);
        res.status(500).json({ error: error.message });
    }
};






exports.getTransactionById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                t.id,
                t.created_date,
                t.user_id,
                u.user_name,
                t.booking_id,
                b.status AS booking_status,
                t.ride_id,
                t.start_reading,
                t.end_reading,
                t.reading_difference,
                t.rate,
                t.calculated_amount,
                t.transaction_id,
                t.status,
                t.amount,
                t.payment_method,
                t.receipt_number,
                t.created_at,
                t.updated_at
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
            return res.status(404).json({ message: "Transaction not found for the provided ID" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching transaction by ID:", error.message);
        res.status(500).json({ error: error.message });
    }
};






exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const {
        end_reading,
        reading_difference,
        rate,
        calculated_amount,
        transaction_id,
      
        amount,
        payment_method,
        receipt_number,
    } = req.body;

    try {
        const [existingTransaction] = await db.query(
            `SELECT * FROM transactions WHERE id = ?`,
            [id]
        );

        if (!existingTransaction.length) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const [result] = await db.query(
            `UPDATE transactions
             SET 
                end_reading = ?, 
                reading_difference = ?, 
                rate = ?, 
                calculated_amount = ?, 
                transaction_id = ?, 
                
                amount = ?, 
                payment_method = ?, 
                receipt_number = ?
             WHERE id = ?`,
            [
                end_reading,
                reading_difference,
                rate,
                calculated_amount,
                transaction_id,
              
                amount,
                payment_method,
                receipt_number,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Transaction update failed" });
        }

        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        console.error("Error updating transaction:", error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.updateAfterTransaction = async (req, res) => {
    const { id } = req.params;
    const {
        
        transaction_id,
        status,
        amount,
        payment_method,
        receipt_number,
    } = req.body;
console.log(receipt_number)
    try {
        const [existingTransaction] = await db.query(
            `SELECT * FROM transactions WHERE id = ?`,
            [id]
        );

        if (!existingTransaction.length) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const [result] = await db.query(
            `UPDATE transactions
             SET 
               
                transaction_id = ?, 
                status = ?, 
                amount = ?, 
                payment_method = ?, 
                receipt_number = ?
             WHERE id = ?`,
            [
              
                transaction_id,
                status,
                amount,
                payment_method,
                receipt_number,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Transaction update failed" });
        }

        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        console.error("Error updating transaction:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            `DELETE FROM transactions WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error.message);
        res.status(500).json({ error: error.message });
    }
};
