// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// const db = pool.promise();

// db.getConnection()
//     .then((connection) => {
//         console.log('Connected to MySQL Database');
//         connection.release();
//     })
//     .catch((err) => {
//         console.error('Error connecting to MySQL:', err.message);
//     });

// module.exports = db;


const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load the appropriate .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'local'}`;
dotenv.config({ path: envFile });

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
        console.log(`Connected to MySQL Database in ${process.env.NODE_ENV || 'local'} mode`);
        connection.release();
    })
    .catch((err) => {
        console.error('Error connecting to MySQL:', err.message);
    });

module.exports = db;
