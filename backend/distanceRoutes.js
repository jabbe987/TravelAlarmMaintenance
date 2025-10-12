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

// Helper function to get coordinates from address
const getCoordinates = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    console.log("response", response); 

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

req.get('/getCityNameFromCoords', async(req, res) => {
    const {lat, lang} = req.query

    try {
        const result = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat, lang}&key=${GOOGLE_API_KEY}&result_type=locality|postal_town`;

        const city = result.result.address_components.long_name

        res.json({city: city, status: 'ok'})
    } catch (error) {
        console.error("Error fetching city from api", error.message)
        res.status(500).json({
            error: 'Failed to fetch data.',
            details: error.message
        });
    }
})

export default router;