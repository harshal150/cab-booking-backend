const db = require('../config/db');

// Fetch all drivers
exports.getAllDrivers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.id, d.driver_name, d.driver_mobile_no, d.status, c.name AS assigned_cab
            FROM drivers d
            LEFT JOIN cars c ON d.assigned_cab_id = c.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch a single driver by ID
exports.getDriverById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
            SELECT d.id, d.driver_name, d.driver_mobile_no, d.status, c.name AS assigned_cab
            FROM drivers d
            LEFT JOIN cars c ON d.assigned_cab_id = c.id
            WHERE d.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new driver
exports.createDriver = async (req, res) => {
    try {
        const { driver_name, driver_mobile_no, status, assigned_cab_id } = req.body;

        const [result] = await db.query(`
            INSERT INTO drivers (driver_name, driver_mobile_no, status, assigned_cab_id)
            VALUES (?, ?, ?, ?)
        `, [driver_name, driver_mobile_no, status || 'available', assigned_cab_id]);

        res.status(201).json({ message: 'Driver created', driverId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update driver info
exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driver_name, driver_mobile_no, status, assigned_cab_id } = req.body;

        const [result] = await db.query(`
            UPDATE drivers
            SET driver_name = ?, driver_mobile_no = ?, status = ?, assigned_cab_id = ?
            WHERE id = ?
        `, [driver_name, driver_mobile_no, status, assigned_cab_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json({ message: 'Driver updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a driver
exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM drivers WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json({ message: 'Driver deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
