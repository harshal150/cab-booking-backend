const db = require('../config/db');
// Mark car as unavailable for a specific date
exports.makeCarUnavailable = async (req, res) => {
    try {
      const { car_id, unavailable_date } = req.body;
  
      // Validate car exists
      const [car] = await db.query('SELECT * FROM cars WHERE id = ?', [car_id]);
      if (!car.length) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      // Insert the unavailable date
      await db.query(
        'INSERT INTO car_unavailable_dates (car_id, unavailable_date) VALUES (?, ?)',
        [car_id, unavailable_date]
      );
  
      res.status(200).json({ message: 'Car marked as unavailable for the specified date' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


// Reset car availability for past dates
exports.resetCarAvailability = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date

        // Delete past unavailable dates
        const [result] = await db.query(
            'DELETE FROM car_unavailable_dates WHERE unavailable_date < ?',
            [today]
        );

        res.status(200).json({
            message: 'Car availability reset for past dates',
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
