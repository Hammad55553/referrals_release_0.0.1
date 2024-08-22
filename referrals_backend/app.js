const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userProfileRoutes = require('./src/routes/userProfileRoutes');
const friendshipRoutes = require('./src/routes/friendshipRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);	 
app.use('/api/profile', userProfileRoutes);
app.use('/api/friendship', friendshipRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
