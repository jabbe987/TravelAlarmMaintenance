import dotenv from "dotenv";
dotenv.config();

import express from "express";
import axios from "axios";

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

const router = express.Router();;



const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;


router.post('/update-eta', async (req, res) => {
    const { lat, lng } = req.query;


    if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing coordinates' });
    }


    try {
        // Get active trip for the user
        const [trip] = await db.query(
            "SELECT Trip_ID, End FROM Trips WHERE User_ID = 1 AND Trip_ID = (SELECT Active_trip FROM User WHERE User_ID = 1)"
        );


        if (!trip) {
            return res.json({ isActive: false }); // Stop ETA updates if no trip
        }


        const destination = trip.End;


        // Call Google Maps API to get new ETA
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}&mode=driving`;


        const response = await axios.get(url);
        const elements = response.data.rows[0]?.elements[0];


        if (!elements || elements.status !== 'OK') {
            return res.status(400).json({ error: 'Failed to get distance data' });
        }


        const newETA = elements.duration.text; // Example: "20 mins"


        // Update ETA in database
        await db.query("UPDATE Trips SET ETA = ? WHERE Trip_ID = ?", [newETA, trip.Trip_ID]);


        res.json({ success: true, newETA, isActive: true });


    } catch (error) {
        console.error("Error updating ETA:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
