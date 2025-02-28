const express = require('express');
const router = express.Router();
const axios = require('axios');




router.get('/active-trip-status', async (req, res) => {
    try {
        const [user] = await db.query("SELECT Active_trip FROM User WHERE User_ID = 1");


        if (user && user.Active_trip) {
            return res.json({ isActive: true });
        }


        res.json({ isActive: false });
    } catch (error) {
        console.error("Error checking active trip:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;