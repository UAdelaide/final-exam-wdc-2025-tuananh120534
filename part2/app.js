const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);


// ✅ ESLint-compliant version
router.post('/logout', (req, res) => {
  req.session.destroy((err) => { // <-- add parentheses around err
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});




// Export the app instead of listening here
module.exports = app;
