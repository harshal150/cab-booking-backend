const db = require('../config/db');

// Get all cars
exports.getAllCars = async (req, res) => {
    try {
        const { booking_date } = req.query; // Accept booking_date as a query parameter

        const [rows] = await db.query(`
            SELECT 
                c.id AS car_id,
                c.name AS car_name,
                c.rate_per_km,
                c.fixed_charges,
                c.status,
                d.id AS assigned_driver_id,
                d.driver_name AS assigned_driver_name,
                d.driver_mobile_no AS assigned_driver_mobile,
                IF(
                    EXISTS(
                        SELECT 1 
                        FROM car_unavailable_dates cud 
                        WHERE cud.car_id = c.id 
                        AND cud.unavailable_date = ?
                    ), 
                    'Not Available', 
                    c.status
                ) AS availability
            FROM 
                cars c
            LEFT JOIN 
                drivers d ON c.id = d.assigned_cab_id
        `, [booking_date]);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).json({ error: error.message });
    }
};

  



// Get a single car by ID
exports.getSingleCar = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                c.id AS car_id,
                c.name AS car_name,
                c.rate_per_km,
                c.fixed_charges,
                c.status,
                d.id AS assigned_driver_id,
                d.driver_name AS assigned_driver_name,
                d.driver_mobile_no AS assigned_driver_mobile
            FROM 
                cars c
            LEFT JOIN 
                drivers d ON c.id = d.assigned_cab_id
            WHERE 
                c.id = ?
        `, [id]);

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
// Update an existing car and set status for a specific date
exports.updateCar = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, rate_per_km, fixed_charges, status, unavailable_date } = req.body;
  
      // Check if the car exists
      const [existingCar] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
      if (!existingCar.length) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      // Update the car status
      if (status) {
        await db.query(
          `UPDATE cars
           SET status = ?
           WHERE id = ?`,
          [status, id]
        );
  
        // If unavailable_date is provided, insert into the unavailable dates table
        if (unavailable_date) {
          await db.query(
            'INSERT INTO car_unavailable_dates (car_id, unavailable_date) VALUES (?, ?)',
            [id, unavailable_date]
          );
        }
      }
  
      // Update other car details if provided
      await db.query(
        `UPDATE cars
         SET name = ?, rate_per_km = ?, fixed_charges = ?
         WHERE id = ?`,
        [name || existingCar[0].name, rate_per_km || existingCar[0].rate_per_km, fixed_charges || existingCar[0].fixed_charges, id]
      );
  
      res.status(200).json({ message: 'Car updated successfully' });
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


exports.assignDriverToCar = async (req, res) => {
    try {
        const { driver_id, car_id } = req.body;

        // Check if the driver exists
        const [driver] = await db.query('SELECT * FROM drivers WHERE id = ?', [driver_id]);
        if (!driver.length) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if the car exists
        const [car] = await db.query('SELECT * FROM cars WHERE id = ?', [car_id]);
        if (!car.length) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Assign the car to the driver
        const [result] = await db.query(
            `UPDATE drivers
             SET assigned_cab_id = ?
             WHERE id = ?`,
            [car_id, driver_id]
        );

        res.status(200).json({ message: 'Driver assigned to car successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

