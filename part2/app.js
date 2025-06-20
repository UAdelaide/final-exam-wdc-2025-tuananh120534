const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session');

app.use(session({
  secret: 'supersecuresecret', // Change in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true only if using HTTPS
}));


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;