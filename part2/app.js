const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const app = express();
const db = require('./models/db');

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

app.use('/api/dogs', dogsRouter);

// Export the app instead of listening here
module.exports = app;
