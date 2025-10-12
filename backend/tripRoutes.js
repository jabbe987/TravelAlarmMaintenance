import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sqlite3 from "sqlite3";

import { fileURLToPath } from "url";
import path from "path";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use DB_PATH from .env or fallback
const dbPath = process.env.DB_PATH || path.join(__dirname, "travelAlarm.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Could not connect to database:", err.message);
  } else {
    console.log(`✅ Connected to SQLite database at ${dbPath}`);
  }
});

const router = express.Router();

// Database connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });

// List all trips
router.get('/trips', (req, res) => {
    // console.log("LISTING TRIPS LOCALLY")
    db.all('SELECT * FROM Trip', (err, results) => {
        console.log(results)
        if (err) return res.status(500).json({ error: err.message });
        return res.json(results);
    });
});

// Get trip details by ID
router.get('/trips/:id', (req, res) => {
    const tripId = req.params.id;  
    db.get('SELECT * FROM Trip WHERE Trip_ID = ?', [tripId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Trip not found' });
        return res.json(results);
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
    
    db.run(
        'INSERT INTO Trip (Alarm_ID, User_ID, Start, End, ETA) VALUES (?, ?, ?, ?, ?)',
        [Alarm_ID || null, User_ID, Start, End, parsedETA],
        (err, results) => {
            // console.log("RESULT: ", err, results)
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Trip added successfully'});
        }
    );

    
});

// Start a trip (update start_time)
router.put('/trips/start/:id', (req, res) => {
    const tripId = req.params.id;
    const { start_time } = req.body;
    db.run(
        'UPDATE trips SET start_time = ? WHERE id = ?',
        [start_time, tripId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Trip started successfully' });
        }
    );
});

// Stop a trip (update end_time)
router.put('/trips/stop/:id', (req, res) => {
    const tripId = req.params.id;
    const { end_time } = req.body;
    db.run(
        'UPDATE trips SET end_time = ? WHERE id = ?',
        [end_time, tripId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Trip stopped successfully' });
        }
    );
});

// Set an alarm for a trip
router.post('/alarms', (req, res) => {
    const { trip_id, alarm_time, status } = req.body;
    db.run(
        'INSERT INTO alarms (trip_id, alarm_time, status) VALUES (?, ?, ?)',
        [trip_id, alarm_time, status || 'active'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Alarm set successfully' });
        }
    );
});

// Dismiss an alarm
router.put('/alarms/dismiss/:id', (req, res) => {
    const alarmId = req.params.id;
    db.run(
        'UPDATE alarms SET status = "dismissed" WHERE id = ?',
        [alarmId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: 'Alarm dismissed successfully' });
        }
    );
});

export default router;