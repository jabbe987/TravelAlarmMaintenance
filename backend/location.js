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

// Get all locations
router.get('/locations', (req, res) => {
    db.query('SELECT * FROM Location', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/addLocation', (req, res) => {
    const { label, value } = req.body;
    if (label == null|| value == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.query(
        'INSERT INTO Location (Name, Coordinates) VALUES (?, ?)',
        [label, value],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Location added successfully', id: results.insertId });
        }
    );
})

export default router;