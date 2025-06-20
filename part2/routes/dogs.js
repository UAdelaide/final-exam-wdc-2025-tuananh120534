const express = require('express');
const router = express.Router();
const db = require('../../models/db');

// GET /api/dogs - fetch all dogs from the database
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Dogs');
    res.json(rows); // return all dogs
  } catch (err) {
    console.error('Error fetching dogs:', err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
