const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL database setup
const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService'
});

// Middleware
app.use(express.json());
app.use(session({
  secret: 'dog-walk-secret',
  resave: false,
  saveUninitialized: false
}));

// Serve static files (login.html, dashboards, etc.)
app.use(express.static(path.join(__dirname, '.')));

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const user = rows[0];

    req.session.user = {
      id: user.user_id,
      username: user.username,
      role: user.role
    };

    res.json({ role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Session check route (optional for debugging)
app.get('/api/users/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
