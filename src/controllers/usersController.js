const db = require('../config/db');

// Fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new user
exports.createUser = async (req, res) => {
    try {
        const { user_name, email, mobile_no, num_passengers } = req.body;

        const [result] = await db.query(
            'INSERT INTO users (user_name, email, mobile_no, num_passengers) VALUES (?, ?, ?, ?)',
            [user_name, email, mobile_no, num_passengers]
        );

        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user info
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_name, email, mobile_no, num_passengers } = req.body;

        const [result] = await db.query(
            'UPDATE users SET user_name = ?, email = ?, mobile_no = ?, num_passengers = ? WHERE id = ?',
            [user_name, email, mobile_no, num_passengers, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
