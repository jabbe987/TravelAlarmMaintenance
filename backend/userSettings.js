import 'dotenv/config';
import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'travelAlarm.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ DB connect error:', err.message);
  else console.log(`✅ Connected to SQLite at ${dbPath}`);
});

const router = express.Router();

// GET /settings/:userId  — returnera EN rad (objekt)
router.get('/settings/:userId', (req, res) => {
  const { userId } = req.params;

  db.get(
    // SQLite: INTEGER istället för UNSIGNED
    'SELECT User_ID, CAST(AlarmType AS INTEGER) AS AlarmType, AlarmValue FROM User WHERE User_ID = ?',
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'User not found' });
      return res.json(row);           // ✅ skicka objektet (inte results[0])
    }
  );
});

// POST /settings — uppdatera & använd this.changes
router.post('/settings', express.json(), (req, res) => {
  const { userId, alarmType, alarmValue } = req.body;
  if (userId == null || alarmType == null || alarmValue == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const bitAlarmType = alarmType ? 1 : 0;

  db.run(
    'UPDATE User SET AlarmType = ?, AlarmValue = ? WHERE User_ID = ?',
    [bitAlarmType, alarmValue, userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      return res.json({ message: 'Settings updated successfully' });
    }
  );
});

// GET /alarm/:userId — returnera EN rad
router.get('/alarm/:userId', (req, res) => {
  const { userId } = req.params;
  db.get('SELECT Alarm_ID FROM User WHERE User_ID = ?', [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    return res.json(row);
  });
});

// POST /alarm — uppdatera & använd this.changes
router.post('/alarm', express.json(), (req, res) => {
  const { userId, alarmId } = req.body;
  if (!userId || !alarmId) return res.status(400).json({ error: 'Missing required fields' });

  db.run('UPDATE User SET Alarm_ID = ? WHERE User_ID = ?', [alarmId, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'Alarm sound updated successfully' });
  });
});

export default router;
