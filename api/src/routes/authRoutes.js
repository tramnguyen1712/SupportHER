//authentication routes to handle POST endpoints for user authentication (registration, login, and logout)

const express = require('express');
const user = require('../models/user');

// 3 routers for each endpoint: login, logout, register
const createAuthRouter = () => {
  const loginRouter = express.Router();
  const logoutRouter = express.Router();
  const registerRouter = express.Router();

  // LOGIN endpoint

  loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Find user by username
      const foundUser = await user.findByUsername(username);

      if (!foundUser) {
        return res.status(401).json({ error: 'Invalid login' });
      }

      // Validate password
      const valid = await foundUser.validatePassword(password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid login' });
      }

      // Return success with user ID
      res.json({
        message: 'login successful',
        userId: foundUser.id
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'login failed' });
    }
  });


  // LOGOUT endpoint
  logoutRouter.post('/', (req, res) => {
    res.json({ message: 'Logout successful' });
  });

// REGISTER endpoint
  registerRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Create new user in database
      await user.create(username, password);
      res.json({ message: 'User created' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Return all three routers for mounting at different paths
  return { loginRouter, logoutRouter, registerRouter };
};

module.exports = createAuthRouter();