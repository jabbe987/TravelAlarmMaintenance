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

// 🔹 Get user settings (Convert BIT(1) properly)
router.get('/settings/:userId', (req, res) => {
    const { userId } = req.params;

    db.query(
        'SELECT User_ID, CAST(AlarmType AS UNSIGNED) AS AlarmType, AlarmValue FROM User WHERE User_ID = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(results[0]); // ✅ Send JSON with converted BIT(1) as integer
        }
    );
});

// 🔹 Update user settings (Handle BIT(1) correctly)
router.post('/settings', (req, res) => {
    const { userId, alarmType, alarmValue } = req.body;

    if (userId === undefined || alarmType === undefined || alarmValue === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const bitAlarmType = alarmType ? 1 : 0; // Ensure 0 or 1

    db.query(
        'UPDATE User SET AlarmType = ?, AlarmValue = ? WHERE User_ID = ?',
        [bitAlarmType, alarmValue, userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'Settings updated successfully' });
        }
    );
});

module.exports = router;