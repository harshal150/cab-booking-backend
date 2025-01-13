const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const db = pool.promise();

db.getConnection()
    .then((connection) => {
        console.log('Connected to MySQL Database');
        connection.release();
    })
    .catch((err) => {
        console.error('Error connecting to MySQL:', err.message);
    });

module.exports = db;
