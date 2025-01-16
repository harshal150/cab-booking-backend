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
                b.status,
                b.approx_hours
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
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.booking_time,
                c.name AS cab_name,
                d.driver_name,
                u.user_name AS user_name,
                b.status,
                b.approx_hours
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

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Add a new booking

exports.createBooking = async (req, res) => {
    const { booking_date, booking_time, cab_id, driver_id, user_id, status, approx_hours } = req.body;
  
    try {
      // Insert the booking details into the bookings table
      await db.query(
        `INSERT INTO bookings (booking_date, booking_time, cab_id, driver_id, user_id, status, approx_hours)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [booking_date, booking_time, cab_id, driver_id, user_id, status, approx_hours]
      );
  
      // Update the car_unavailable_dates table for the specific car and date
      await db.query(
        `INSERT INTO car_unavailable_dates (car_id, unavailable_date)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE unavailable_date = VALUES(unavailable_date)`,
        [cab_id, booking_date]
      );
  
      res.status(201).json({ message: "Booking created and car status updated successfully" });
    } catch (error) {
      console.error("Error in createBooking:", error);
      res.status(500).json({ error: error.message });
    }
  };



// Update booking info
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_date, booking_time, cab_id, driver_id, user_id, status, approx_hours } = req.body;

        // Validate foreign keys (cab_id, driver_id, user_id) here if needed...

        // Check if the booking exists
        const [existingBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
        if (!existingBooking.length) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the booking with approx_hours
        const [result] = await db.query(
            `UPDATE bookings
             SET booking_date = ?, booking_time = ?, cab_id = ?, driver_id = ?, user_id = ?, status = ?, approx_hours = ?
             WHERE id = ?`,
            [booking_date, booking_time, cab_id, driver_id, user_id, status, approx_hours, id]
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
