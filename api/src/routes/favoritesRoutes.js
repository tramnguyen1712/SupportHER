const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const Business = require('../models/business');

// GET all favorites for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required" });
        }

        const favorites = await Favorite.getByUserId(userId);
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "couldn't fetch favorites" });
    }
});

// POST a new favorite
router.post('/', async (req, res) => {
    try {
        const { userId, businessId } = req.body;

        if (!userId || !businessId) {
            return res.status(400).json({ error: "userId and businessId are required" });
        }

        // Check if business exists
        const business = await Business.getById(businessId);
        if (!business) {
            return res.status(404).json({ error: "business doesn't exist" });
        }

        // Check if already favorited
        const exists = await Favorite.exists(userId, businessId);
        if (exists) {
            return res.status(400).json({ error: "business is already in favorites" });
        }

        await Favorite.create(userId, businessId);
        res.json({ message: "favorite added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to add favorite" });
    }
});

// DELETE a favorite
router.delete('/:businessId', async (req, res) => {
    try {
        const userId = req.query.userId;
        const businessId = req.params.businessId;

        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required" });
        }

        const exists = await Favorite.exists(userId, businessId);
        if (!exists) {
            return res.status(404).json({ error: "favorite not found" });
        }

        await Favorite.delete(userId, businessId);
        res.json({ message: "favorite removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to remove favorite" });
    }
});

module.exports = router;
