const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');

const app = express();

// Setup DB
const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService' // Make sure this matches your DB
});

// Setup sessions
app.use(session({
  secret: 'dog-walking-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
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
});
