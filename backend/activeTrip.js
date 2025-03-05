require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// ✅ Use connection pool for better performance
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,  // ✅ Adjust if needed
    queueLimit: 0
});

// ✅ Ensure database connection works
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Database connected successfully!");
        connection.release(); // ✅ Release connection after checking
    }
});

router.get('/active-trip-status', async (req, res) => {
    try {
        console.log("🔍 Fetching active trip from user...");

        // ✅ Use `.promise().query()` to properly handle async/await
        const [rows] = await db.promise().query("SELECT Active_trip FROM User WHERE User_ID = 1");

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

module.exports = router;
