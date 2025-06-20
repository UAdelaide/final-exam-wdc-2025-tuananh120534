const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');


const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false
}));

const username = form.username.value;
const password = form.password.value;



// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.redirect('/login.html');
});


// Export the app instead of listening here
module.exports = app;