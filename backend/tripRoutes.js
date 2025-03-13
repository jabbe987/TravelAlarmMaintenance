require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const router = express.Router();  // ✅ Use Router instead of a new Express app

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// List all trips
router.get('/trips', (req, res) => {
    // console.log("LISTING TRIPS LOCALLY")
    db.query('SELECT * FROM Trip', (err, results) => {
        console.log(results)
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get trip details by ID
router.get('/trips/:id', (req, res) => {
    const tripId = req.params.id;  
    db.query('SELECT * FROM Trip WHERE Trip_ID = ?', [tripId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Trip not found' });
        res.json(results);
    });
});

function parseToMySQLTime(duration) {
    const hoursMatch = duration.match(/(\d+)\s*hour/);
    const minutesMatch = duration.match(/(\d+)\s*min/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

// Add a new trip
router.post('/addtrip', (req, res) => {
    // console.log("ADDING TRIPS LOCALLY")
    const { Alarm_ID, User_ID, Start, End, ETA } = req.body;
    // console.log(Alarm_ID, User_ID, Start, End, ETA)
    if (User_ID == null|| Start == null || End == null || ETA == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log("NOW INSERTING")

    const parsedETA = parseToMySQLTime(ETA);
    
    db.query(
        'INSERT INTO Trip (Alarm_ID, User_ID, Start, End, ETA) VALUES (?, ?, ?, ?, ?)',
        [Alarm_ID || null, User_ID, Start, End, parsedETA],
        (err, results) => {
            // console.log("RESULT: ", err, results)
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Trip added successfully', id: results.insertId });
        }
    );

    
});

// Start a trip (update start_time)
router.put('/trips/start/:id', (req, res) => {
    const tripId = req.params.id;
    const { start_time } = req.body;
    db.query(
        'UPDATE trips SET start_time = ? WHERE id = ?',
        [start_time, tripId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Trip started successfully' });
        }
    );
});

// Stop a trip (update end_time)
router.put('/trips/stop/:id', (req, res) => {
    const tripId = req.params.id;
    const { end_time } = req.body;
    db.query(
        'UPDATE trips SET end_time = ? WHERE id = ?',
        [end_time, tripId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Trip stopped successfully' });
        }
    );
});

// Set an alarm for a trip
router.post('/alarms', (req, res) => {
    const { trip_id, alarm_time, status } = req.body;
    db.query(
        'INSERT INTO alarms (trip_id, alarm_time, status) VALUES (?, ?, ?)',
        [trip_id, alarm_time, status || 'active'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Alarm set successfully', alarmId: result.insertId });
        }
    );
});

// Dismiss an alarm
router.put('/alarms/dismiss/:id', (req, res) => {
    const alarmId = req.params.id;
    db.query(
        'UPDATE alarms SET status = "dismissed" WHERE id = ?',
        [alarmId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Alarm dismissed successfully' });
        }
    );
});

module.exports = router; // ✅ Export the router
