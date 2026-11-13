const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const express = require('express');
const { loginRouter, logoutRouter, registerRouter } = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const businessesRoutes = require('./routes/businessesRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const submissionRoutes = require('./routes/submissionRoutes');


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
// app.use('/users', userRoutes);

// use the routes
app.get('/', (req, res) => {
  res.json({
    message: 'SupportHER API',
    endpoints: [
      'POST /login',
      'POST /logout',
      'POST /register',
      'GET /users',
      'GET /users/:userId',
      'GET /businesses',
      'GET /businesses/:businessId',
      'POST /businesses/:businessId/reviews',
      'GET /businesses/:businessId/reviews',
      'GET /favorites',
      'POST /favorites',
      'DELETE /favorites/:businessId',
      'GET /events',
      'GET /events/:eventId',
      'POST /submissions',
      'GET /submissions'
    ]
  });
});


// Mount route handlers
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/users', userRoutes);
app.use('/businesses', businessesRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/events', eventsRoutes);
app.use('/submissions', submissionRoutes);


// error handling middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));