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
    db.query('SELECT * FROM Trip', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get trip details by ID
router.get('/trips/:id', (req, res) => {
    const tripId = req.params.id;  // ✅ Fixed: Use req.params.id instead of undefined tripId
    db.query('SELECT * FROM trips WHERE id = ?', [tripId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Trip not found' });
        res.json(results);
    });
});

// Add a new trip
router.post('/trips', (req, res) => {
    const { user_id, start_location, end_location, start_time, eta } = req.body;
    db.query(
        'INSERT INTO trips (user_id, start_location, end_location, start_time, eta) VALUES (?, ?, ?, ?, ?)',
        [user_id, start_location, end_location, start_time, eta],
        (err, results) => {
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
