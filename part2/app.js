const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');

const app = express();

// Connect to MySQL
let db;
mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dogwalkservice'
}).then((connection) => {
  db = connection;
  console.log('✅ Connected to MySQL');
}).catch(err => console.error('❌ Database connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Route: default page shows login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// POST /login - validate credentials and redirect
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE email = ? AND password_hash = ?',
      [email, password]
    );

    if (rows.length === 0) {
      // Invalid login
      return res.redirect('/login.html?error=1');
    }

    // Save user info to session
    req.session.user = {
      id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    // Redirect based on role
    if (rows[0].role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    } else if (rows[0].role === 'walker') {
      return res.redirect('/walker-dashboard.html');
    } else {
      return res.redirect('/login.html?error=1');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});
