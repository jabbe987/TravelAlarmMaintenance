require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,  // Your friend's server IP
    user: process.env.DB_USER,         // MySQL username
    password: process.env.DB_PASS,     // MySQL password
    database: process.env.DB_NAME, // Change this to your actual database
    port: process.env.DB_PORT
});

//lists all trips in the database
app.get('/trips', (req, res) => {
    db.query('SELECT * FROM trips', (err, results) => {
        if (err) return res.status(500).json({ error: err.message});
        res.json(results);
    });
}); 

//Get trips details by id
app.get('/trips/:id', (req, res) => {
    db.query('SELECT * FROM trips WHERE id = ?', [tripId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message});
        if(resuslts.length === 0) return res.status(404).json({ error: 'Trip not found'});
        res.json(results);
    });
});


//Add a new trip to the database
app.post('/trips', (req, res) => {
    const {user_id, start_location, end_location, start_time, eta} = req.body;

    db.query(
        'INSERT INTO trips (user_id, start_location, end_location, start_time, eta) VALUES (?, ?, ?, ?, ?)', [user_id, start_location, end_location, start_time, eta], (err, results) => {
            if (err) return res.status(500).json({ error: err.message});
            res.json({ message: 'Trip added successfully', id: results.insertId});
        }
    );
});


//Start a trip (update start_time)
app.put('/trips/start/:id', (req, res) => {
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


//Stop a trip (update end_time)
app.put('/trips/stop/:id', (req, res) => {
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


//Set an alarm for a trip 
app.post('/alarms', (req, res) => {
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

//dismiss an alarm 
app.put('/alarms/dismiss/:id', (req, res) => {
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
