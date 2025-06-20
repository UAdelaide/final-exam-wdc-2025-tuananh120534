const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./models/db'); // ✅ dùng db.js
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// ✅ Session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// ✅ Trang mặc định → login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ POST /login → check DB và chuyển dashboard
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE email = ? AND password_hash = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.send(`
        <html>
          <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; margin-top: 100px;">
            <h2 style="color: red;">Invalid</h2>
            <a href="/" style="text-decoration: none; color: blue;">Back to Login</a>
          </body>
        </html>
      `);
    }

    req.session.user = {
      id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    if (rows[0].role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    } else if (rows[0].role === 'walker') {
      return res.redirect('/walker-dashboard.html');
    } else {
      return res.send('Unknown role');
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// ✅ Giữ nguyên các routes gốc
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// ✅ Export app (nếu dùng test hoặc entry point riêng)
module.exports = app;
