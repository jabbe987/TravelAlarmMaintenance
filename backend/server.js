
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const tripRoutes = require('./tripRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,  // Your friend's server IP
//     user: process.env.DB_USER,         // MySQL username
//     password: process.env.DB_PASS,     // MySQL password
//     database: process.env.DB_NAME, // Change this to your actual database
//     port: process.env.DB_PORT
// });

// ✅ Use connection pooling
const db = mysql.createPool({
    host: process.env.DB_HOST,  // Your friend's server IP
    user: process.env.DB_USER,  // MySQL username
    password: process.env.DB_PASS,  // MySQL password
    database: process.env.DB_NAME, // Your database name
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,  // Max number of connections
    queueLimit: 0
}).promise(); // 👈 Using promise-based API

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//         return;
//     }
//     console.log('Connected to database');
// });

console.log('Connected to database');
console.log(tripRoutes);


// // ✅ API Route to Fetch Words
// app.get('/api/words', (req, res) => {
//     db.query('SELECT * FROM words', (err, results) => {
//         if (err) {
//             console.error('Error fetching words:', err);
//             return res.status(500).json({ error: 'Database query error' });
//         }
//         res.json(results); // ✅ Send retrieved words as JSON
//     });
// });

// // Sample API route
// app.get('/users', (req, res) => {
//     db.query('SELECT * FROM users', (err, results) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//         } else {
//             res.json(results);
//         }
//     });
// });

app.use('/api', tripRoutes);

// ✅ API Route to Fetch Words
app.get('/api/words', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM words');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ error: 'Database query error' });
    }
});

// ✅ API Route to Fetch Users
app.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
