// routes/distance.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

/*const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.get('/distance', async (req, res) => {
    const { origins, destinations } = req.query;

    if (!origins || !destinations) {
        return res.status(400).json({ error: 'Origins and destinations are required.' });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch distance matrix', details: error.message });
    }
});

module.exports = router;*/
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.get('/distance', async (req, res) => {
    const { origins, destinations } = req.query;

    if (!origins || !destinations) {
        return res.status(400).json({ error: 'Origins and destinations are required.' });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log("API Response:", JSON.stringify(response.data, null, 2));

        if (response.data.status !== 'OK') {
            return res.status(400).json({
                error: 'API request failed.',
                details: response.data.error_message || response.data.status
            });
        }

        const elements = response.data.rows?.[0]?.elements?.[0];

        if (!elements || elements.status !== 'OK') {
            return res.status(400).json({
                error: 'No distance data available.',
                details: elements?.status || 'Unknown error.'
            });
        }

        const distance = elements.distance?.text;
        const duration = elements.duration?.text;

        res.json({ distance, duration });
    } catch (error) {
        console.error("Error fetching distance:", error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to fetch distance matrix.',
            details: error.response?.data?.error_message || error.message
        });
    }
});

module.exports = router;
