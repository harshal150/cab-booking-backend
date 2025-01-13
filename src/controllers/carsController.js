const db = require('../config/db');

// Get all cars
exports.getAllCars = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cars');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single car by ID
exports.getSingleCar = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new car
exports.createCar = async (req, res) => {
    try {
        const { name, rate_per_km, fixed_charges, status } = req.body;

        const [result] = await db.query(
            'INSERT INTO cars (name, rate_per_km, fixed_charges, status) VALUES (?, ?, ?, ?)',
            [name, rate_per_km, fixed_charges, status || 'available']
        );

        res.status(201).json({ message: 'Car created', carId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing car
exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rate_per_km, fixed_charges, status } = req.body;

        const [result] = await db.query(
            'UPDATE cars SET name = ?, rate_per_km = ?, fixed_charges = ?, status = ? WHERE id = ?',
            [name, rate_per_km, fixed_charges, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a car
exports.deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM cars WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
