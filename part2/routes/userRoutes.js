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

    // respond with Unauthorized, if its invalid
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid' });
    }

    // If user is found, store basic user info in the session
    req.session.user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    // Respond with success
    res.json({ message: 'Login successfully', role: rows[0].role });

  } catch (error) {
    // unexpected server/database errors
    res.status(500).json({ error: 'Login failed' });
  }
});
// POST /logout: Ends the session and clears the session cookie
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // If there's an error
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');

    // Respond with a success message
    res.json({ message: 'Logged out' });
  });
});

// GET /mydogs
router.get('/mydogs', async (req, res) => {
  // Check if user is logged in and is an owner
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [rows] = await db.query(
      `SELECT dog_id, name FROM Dogs WHERE owner_id = ?
    `, [req.session.user.user_id]);

    res.json(rows);
  } catch (err) {
    // Log error
    console.error('Error fetching dogs:', err);
    res.status(500).json({ error: 'Failed to load dogs' });
  }
});


// GET /api/users/me - returns the current logged-in user's session info
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Send the user session info (e.g., user_id, username, role)
  res.json(req.session.user);
});



module.exports = router;