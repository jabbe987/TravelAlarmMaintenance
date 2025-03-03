const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/active-trip-status', async (req, res) => {
    try {
        console.log("before getting the active trip from user");

        // Fetch result from database
        const [rows] = await db.query("SELECT Active_trip FROM User WHERE User_ID = 1");
        console.log("Query Result:", rows);

        if (!rows || rows.length === 0) {
            console.log("No user found!");
            return res.json({ isActive: false });
        }

        const user = rows[0]; // Get the first row
        console.log("Extracted User:", user);

        console.log("user.Active_trip:", user?.Active_trip);
        return res.json({ isActive: !!user?.Active_trip });

    } catch (error) {
        console.error("Error checking active trip:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// router.get('/active-trip-status', async (req, res) => {
//     try {
//         console.log("before getting the active trip from user");
//         const [user] = await db.query("SELECT Active_trip FROM User WHERE User_ID = 1");
//         console.log("const [user]: ",user);
//         console.log("user.Active_trip: ",user.Active_trip);
//         console.log("User: ",user);


//         if (user && user.Active_trip) {
//             return res.json({ isActive: true });
//         }


//         res.json({ isActive: false });
//     } catch (error) {
//         console.error("Error checking active trip:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


module.exports = router;
