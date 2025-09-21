
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const tripRoutes = require('./tripRoutes'); 
const distanceRoutes = require('./distanceRoutes');
const locations = require('./location')
const activeTrip = require('./activeTrip');
const updateEta = require('./updateEta');
const userSettings = require('./userSettings'); 
const fetchGoogleEta = require('./fetchGoogleEta')

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
// const db = mysql.createPool({
//     host: process.env.DB_HOST,  // Your friend's server IP
//     user: process.env.DB_USER,  // MySQL username
//     password: process.env.DB_PASS,  // MySQL password
//     database: process.env.DB_NAME, // Your database name
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 10,  // Max number of connections
//     queueLimit: 0
// }).promise(); // 👈 Using promise-based API

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//         return;
//     }
//     console.log('Connected to database');
// });

console.log('Connected to database');
console.log(tripRoutes);
//console.log(distanceRoutes)


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
app.use('/api', distanceRoutes);
app.use('/api', activeTrip);
app.use('/api', updateEta);
app.use('/api', userSettings);
app.use('/api', locations);
app.use('/api', fetchGoogleEta)

// ✅ API Route to Fetch Words
app.get('/api/words', async (req, res) => {
    try {
        console.log("inside fetch words"); 
        res.json({ message: "Hello from server", words: ["foo", "bar", "baz"] });
    } catch (error) {
        console.error("Error1 fetching words:", error);
        res.status(500).json({ error: "Server error" });
    }
    // try {
    //     const [rows] = await db.query('SELECT * FROM words');
    //     res.json(rows);
    // } catch (error) {
    //     console.error('Error fetching words:', error);
    //     res.status(500).json({ error: 'Database query error' });
    // }
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

app.get('/api/config', (req, res) => {
    res.json({ GOOGLE_API_KEY: process.env.GOOGLE_MAPS_API_KEY });
    console.log("🔍 GOOGLE_API_KEY from env:", process.env.GOOGLE_MAPS_API_KEY);
});


// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});