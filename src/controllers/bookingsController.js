const db = require('../config/db');

// Fetch all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.booking_time,
                b.cab_id,
                c.name AS cab_name,
                d.driver_name,
                d.driver_mobile_no,
                b.user_id,
                u.user_name AS user_name,
                u.mobile_no AS user_mobile_no,
                b.status,
                b.transaction_id,
                t.transaction_date,
                t.amount,
                t.payment_method,
                t.status AS transaction_status
            FROM 
                bookings b
            JOIN 
                cars c ON b.cab_id = c.id
            JOIN 
                drivers d ON b.driver_id = d.id
            JOIN 
                users u ON b.user_id = u.id
            LEFT JOIN 
                transactions t ON b.transaction_id = t.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};







// Fetch a single booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.booking_time,
                b.cab_id,
                c.name AS cab_name,
                d.driver_name,
                d.driver_mobile_no,
                b.user_id,
                u.user_name AS user_name,
                u.mobile_no AS user_mobile_no,
                b.status,
                b.transaction_id,
                t.transaction_date,
                t.amount,
                t.payment_method,
                t.status AS transaction_status
            FROM 
                bookings b
            JOIN 
                cars c ON b.cab_id = c.id
            JOIN 
                drivers d ON b.driver_id = d.id
            JOIN 
                users u ON b.user_id = u.id
            LEFT JOIN 
                transactions t ON b.transaction_id = t.id
            WHERE 
                b.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};









// Add a new booking

exports.createBooking = async (req, res) => {
    const { booking_date, booking_time, cab_id, driver_id, user_id, status } = req.body;

    try {
        await db.query(
            `INSERT INTO bookings (booking_date, booking_time, cab_id, driver_id, user_id, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [booking_date, booking_time, cab_id, driver_id, user_id, status]
        );

        res.status(201).json({ message: "Booking created successfully" });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: error.message });
    }
};





// Update booking info
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_date, booking_time, cab_id, driver_id, user_id, status } = req.body;

        const [existingBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
        if (!existingBooking.length) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await db.query(
            `UPDATE bookings
             SET booking_date = ?, booking_time = ?, cab_id = ?, driver_id = ?, user_id = ?, status = ?
             WHERE id = ?`,
            [booking_date, booking_time, cab_id, driver_id, user_id, status, id]
        );

        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
