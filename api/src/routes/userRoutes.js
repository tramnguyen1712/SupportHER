// User routes to handle GET endpoints for retrieving users

const express = require('express');
const router = express.Router();
const db = require('../db');

// Retrieves an array of all users
router.get('/', async (req, res) => {
  try {
    const users = await db.query("SELECT id, username FROM users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "couldn't fetch users" });
  }
});

// retrieves a user by its Id
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rows = await db.query("SELECT id, username FROM users WHERE id = ?", [userId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "couldn't fetch user" });
  }
});

module.exports = router;
