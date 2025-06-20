const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// Handle POST request to /login for authenticating a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Extract login credentials

  try {
    // Query the Users table to find a user with matching username and password
    const [rows] = await db.query(
      `SELECT user_id, username, role FROM Users
       WHERE username = ? AND password_hash = ?`,
      [username, password]
    );

    // If no user is found, respond with Unauthorized
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid' });
    }

    // If user is found, store basic user info in the session
    req.session.user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    // Respond with success and include the user role (used for redirect)
    res.json({ message: 'Login successfully', role: rows[0].role });

  } catch (error) {
    // Handle unexpected server/database errors
    res.status(500).json({ error: 'Login failed' });
  }
});



module.exports = router;