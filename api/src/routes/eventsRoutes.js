const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.getAll();
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "couldn't fetch events" });
    }
});

// GET saved events for a user
router.get('/saved', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required" });
        }

        const savedEvents = await Event.getSavedByUserId(userId);
        res.json(savedEvents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "couldn't fetch saved events" });
    }
});

// POST save event
router.post('/saved', async (req, res) => {
    try {
        const { userId, eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({ error: "userId and eventId are required" });
        }

        const event = await Event.getById(eventId);

        if (!event) {
            return res.status(404).json({ error: "event doesn't exist" });
        }

        const exists = await Event.isSaved(userId, eventId);

        if (exists) {
            return res.status(400).json({ error: "event is already saved" });
        }

        await Event.saveEvent(userId, eventId);
        res.json({ message: "event saved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to save event" });
    }
});

// DELETE saved event
router.delete('/saved/:eventId', async (req, res) => {
    try {
        const userId = req.query.userId;
        const eventId = req.params.eventId;

        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required" });
        }

        const exists = await Event.isSaved(userId, eventId);

        if (!exists) {
            return res.status(404).json({ error: "saved event not found" });
        }

        await Event.unsaveEvent(userId, eventId);
        res.json({ message: "event removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to remove saved event" });
    }
});

// GET event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.getById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: "event doesn't exist" });
        }

        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to fetch event" });
    }
});

module.exports = router;