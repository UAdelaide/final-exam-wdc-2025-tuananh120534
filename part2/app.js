const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const mysql = require('mysql2/promise');
const app = express();

// Setup session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Setup MySQL pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ExampleDB'
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length === 1) {
      const user = rows[0];
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };
      return res.redirect('/owner-dashboard');
    }

    // No else needed
    return res.send('<p style="color:red">invalid account</p><a href="/">Try again</a>');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// ✅ Owner Dashboard Page
app.get('/owner-dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.send(`<h2>Welcome, ${req.session.user.username}</h2><p>You are logged in as owner.</p>`);
});

// ✅ Default home page to render login form (optional if using static index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Export the app instead of listening here
module.exports = app;