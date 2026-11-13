const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');

// GET all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.getAll();
        res.json(submissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "couldn't fetch submissions" });
    }
});

// GET submission by ID
router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.getById(req.params.id);

        if (!submission) {
            return res.status(404).json({ error: "submission doesn't exist" });
        }

        res.json(submission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to fetch submission" });
    }
});

// POST a new submission
router.post('/', async (req, res) => {
    try {
        const { name, address, city, state, zip, category, contact_email, contact_phone } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name is required" });
        }

        await Submission.create({
            name,
            address,
            city,
            state,
            zip,
            category,
            contact_email,
            contact_phone
        });

        res.json({ message: "submission created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to create submission" });
    }
});

module.exports = router;
