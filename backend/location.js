require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const router = express.Router(); 

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Get all locations
router.get('/locations', (req, res) => {
    db.query('SELECT * FROM Location', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
