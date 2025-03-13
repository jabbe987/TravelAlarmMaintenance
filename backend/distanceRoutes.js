require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Helper function to get coordinates from address
const getCoordinates = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status !== 'OK') {
        throw new Error(`Failed to get coordinates for ${address}: ${response.data.status}`);
    }

    const location = response.data.results[0].geometry.location;
    return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: response.data.results[0].formatted_address
    };
};

router.get('/distance', async (req, res) => {
    const { origins, destinations } = req.query;

    if (!origins || !destinations) {
        return res.status(400).json({ error: 'Origins and destinations are required.' });
    }

    try {
        // Fetch coordinates for origin and destination
        const originCoords = await getCoordinates(origins);
        const destinationCoords = await getCoordinates(destinations);

        // Optionally, you can still fetch distance if needed
        const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${GOOGLE_API_KEY}`;
        const distanceResponse = await axios.get(distanceMatrixUrl);

        if (distanceResponse.data.status !== 'OK') {
            return res.status(400).json({
                error: 'Failed to fetch distance.',
                details: distanceResponse.data.error_message || distanceResponse.data.status,
            });
        }

        const elements = distanceResponse.data.rows[0].elements[0];
        if (!elements || elements.status !== 'OK') {
            return res.status(400).json({
                error: 'No distance data available.',
                details: elements?.status || 'Unknown error.',
            });
        }

        const distance = elements.distance.text;
        const duration = elements.duration.text;

        // Send coordinates, distance, and duration in the response
        res.json({
            origin: originCoords,
            destination: destinationCoords,
            distance,
            duration,
        });

    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            error: 'Failed to fetch data.',
            details: error.message
        });
    }
});

module.exports = router;
