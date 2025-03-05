const express = require("express");
const fetch = require("node-fetch"); // If using Node 18+, use `globalThis.fetch`
require("dotenv").config(); // Load API key from .env file

const router = express.Router();

const GOOGLE_DISTANCE_MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

router.get('/eta', async (req, res) => {
  const { origin, destination } = req.query;
  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure this is set in .env

  if (!origin) return res.status(400).json({ error: "Origin is missing" });
  if (!destination) return res.status(400).json({ error: "Destination is missing" });
  if (!googleApiKey) return res.status(500).json({ error: "Server is missing Google API key" });

  const url = `${GOOGLE_DISTANCE_MATRIX_URL}?origins=${origin}&destinations=${destination}&key=${googleApiKey}`;

  console.log("📡 Making API request to Google ETA:");
  console.log("🔹 URL:", url);

  try {
    console.log("⏳ Fetching Google ETA...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("❌ Google Maps API error:", data.error_message || data.status);
      return res.status(400).json({ error: data.error_message || data.status });
    }

    const elements = data.rows[0].elements[0];
    const etaText = elements.duration.text;

    console.log("🕒 Updated ETA:", etaText);
    res.json({ eta: etaText });
  } catch (error) {
    console.error("❌ Error fetching ETA:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
