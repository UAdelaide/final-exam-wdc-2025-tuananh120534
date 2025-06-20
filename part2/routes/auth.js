const express = require('express');
const router = express.Router();
const db = require('../models/db'); // adjust based on your structure
const bcrypt = require('bcrypt');   // if you're using hashed passwords

// POST /login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role, password_hash FROM Users
      WHERE email = ?
    `, [email]);

    if (rows.length === 0) {
      return res.render('index', { error: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.render('index', { error: 'Invalid email or password.' });
    }

    // Store login in session
    req.session.user = {
      id: user.user_id,
      username: user.username,
      role: user.role
    };

    // Redirect to dashboard based on role
    if (user.role === 'owner') {
      return res.redirect('/owner-dashboard');
    } else if (user.role === 'walker') {
      return res.redirect('/walker-dashboard');
    } else {
      return res.render('index', { error: 'Invalid user role.' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).render('index', { error: 'Server error' });
  }
});

module.exports = router;
