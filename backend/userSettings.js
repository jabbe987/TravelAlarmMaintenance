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

router.get('/alarm/:userId', (req, res) => {
    const { userId } = req.params;

    db.query('SELECT Alarm_ID FROM User WHERE User_ID = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(results[0]); // Return alarm ID
    });
});

router.post('/alarm', (req, res) => {
    const { userId, alarmId } = req.body;

    if (!userId || !alarmId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.query('UPDATE User SET Alarm_ID = ? WHERE User_ID = ?', [alarmId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Alarm sound updated successfully' });
    });
});

export default router;