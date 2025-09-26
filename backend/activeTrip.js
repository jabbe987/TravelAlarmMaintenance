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

router.get('/active-trip-status', async (req, res) => {
    try {
        console.log("🔍 Fetching active trip from user...");

        // ✅ Use `.promise().get()` to properly handle async/await
        const [rows] = await db.promise().get("SELECT Active_trip FROM User WHERE User_ID = 1");

        console.log("✅ Query Result:", rows);

        if (!rows || rows.length === 0) {
            console.log("⚠️ No user found!");
            return res.json({ isActive: false });
        }

        const user = rows[0]; // ✅ Get the first row safely
        console.log("✅ Extracted User:", user);

        console.log("✅ user.Active_trip:", user?.Active_trip);
        return res.json({ isActive: !!user?.Active_trip });

    } catch (error) {
        console.error("❌ Error checking active trip:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

export default router;
