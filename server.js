const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/config/db'); // Import MySQL connection

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/cars', require('./src/routes/carsRoutes')); // Add the cars route
app.use('/api/drivers', require('./src/routes/driversRoutes')); // Add drivers route
app.use('/api/bookings', require('./src/routes/bookingsRoutes')); // Add bookings route
app.use('/api/users', require('./src/routes/usersRoutes')); // Add users route

// Test MySQL connection
db.getConnection()
    .then(() => {
        console.log('Connected to MySQL database.');
    })
    .catch((err) => {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit the app if connection fails
    });

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
