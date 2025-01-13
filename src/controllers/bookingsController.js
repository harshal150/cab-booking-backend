const db = require('../config/db');

// Fetch all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.booking_time,
                c.name AS cab_name,
                d.driver_name,
                u.user_name AS user_name,
                u.email AS user_email,
                u.mobile_no AS user_mobile,
                b.status
            FROM 
                bookings b
            JOIN 
                cars c ON b.cab_id = c.id
            JOIN 
                drivers d ON b.driver_id = d.id
            JOIN 
                users u ON b.user_id = u.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Fetch a single booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID from the URL

        // Query to fetch booking details along with related cab, driver, and user details
        const [rows] = await db.query(`
            SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.booking_time,
                c.name AS cab_name,
                d.driver_name,
                u.user_name AS user_name,
                u.email AS user_email,
                u.mobile_no AS user_mobile,
                b.status
            FROM 
                bookings b
            JOIN 
                cars c ON b.cab_id = c.id
            JOIN 
                drivers d ON b.driver_id = d.id
            JOIN 
                users u ON b.user_id = u.id
            WHERE 
                b.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Return the booking details
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Add a new booking
exports.createBooking = async (req, res) => {
    try {
        const { booking_date, booking_time, cab_id, driver_id, user_id, status } = req.body;

        // Validate cab_id
        const [cab] = await db.query('SELECT id FROM cars WHERE id = ?', [cab_id]);
        if (!cab.length) return res.status(400).json({ message: 'Invalid cab_id' });

        // Validate driver_id
        const [driver] = await db.query('SELECT id FROM drivers WHERE id = ?', [driver_id]);
        if (!driver.length) return res.status(400).json({ message: 'Invalid driver_id' });

        // Validate user_id
        const [user] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (!user.length) return res.status(400).json({ message: 'Invalid user_id' });

        // Insert booking
        const [result] = await db.query(`
            INSERT INTO bookings (booking_date, booking_time, cab_id, driver_id, user_id, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [booking_date, booking_time, cab_id, driver_id, user_id, status || 'not booked']);

        res.status(201).json({ message: 'Booking created', bookingId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update booking info
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID from the route
        const { booking_date, booking_time, cab_id, driver_id, user_id, status } = req.body;

        // Validate cab_id
        const [cab] = await db.query('SELECT id FROM cars WHERE id = ?', [cab_id]);
        if (!cab.length) return res.status(400).json({ message: 'Invalid cab_id' });

        // Validate driver_id
        const [driver] = await db.query('SELECT id FROM drivers WHERE id = ?', [driver_id]);
        if (!driver.length) return res.status(400).json({ message: 'Invalid driver_id' });

        // Validate user_id
        const [user] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (!user.length) return res.status(400).json({ message: 'Invalid user_id' });

        // Check if the booking exists
        const [existingBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
        if (!existingBooking.length) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the booking
        const [result] = await db.query(
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
