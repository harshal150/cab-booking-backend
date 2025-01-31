const db = require('../config/db');

// Admin Login Function
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }

    try {
        // Query database for admin user
        const [rows] = await db.query(`SELECT * FROM admin_users WHERE username = ? AND password = ?`, [username, password]);

        if (rows.length > 0) {
            return res.status(200).json({ message: "Login successful!", user: rows[0] });
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
