const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');

const app = express();

// ✅ Kết nối MySQL
let db;
mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dogwalkservice'
}).then((connection) => {
  db = connection;
  console.log('✅ Connected to MySQL');
}).catch(err => console.error('❌ DB connection error:', err));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// ✅ Route mặc định → login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Xử lý login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE email = ? AND password_hash = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.send('Invalid'); // ❌ Login failed
    }

    // ✅ Lưu session
    req.session.user = {
      id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    // ✅ Redirect theo role
    if (rows[0].role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    } else if (rows[0].role === 'walker') {
      return res.redirect('/walker-dashboard.html');
    } else {
      return res.send('Invalid');
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// ✅ Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
