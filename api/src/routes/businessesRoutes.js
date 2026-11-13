const express = require('express');
const router = express.Router();

const Business = require('../models/business');
const Review = require('../models/review');

router.get('/', async(req, res) => {
    try{
        const businesses = await Business.getAll();
        res.json(businesses);
    } catch(err){
        console.error(err);
        res.status(500).json({error: "couldn't fetch businesses"});
    }
});

router.get('/:id', async(req, res) => {
    try{
        const business = await Business.getById(req.params.id);

        if(!business){
            return res.status(404).json({error: "business doesn't exist"});
        }

        const reviews = await Review.getByBusinessId(req.params.id);
        res.json({
            business,
            reviews
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "failed fetch"});
    }
});

router.post('/', async (req, res) => {
    try{
        const {name, address, city, state, zip} = req.body;

        if(!name){
            return res.status(400).json({error: "Name required"});
        }
        await Business.create({name, address, city, state, zip});

        res.json({message: "business created"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "failed to create business"});
    }
});

router.get('/:id/reviews', async (req, res) =>{
    try{
        const reviews = await Review.getByBusinessId(req.params.id);
        res.json(reviews);
    }catch(err) {
        console.error(err);
        res.status(500).json({error: "failed to fetch reviews"});
    }
});

router.post('/:id/reviews', async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const businessId = req.params.id;

        if (!userId || !rating) {
            return res.status(400).json({ error: "userId and rating are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "rating must be between 1 and 5" });
        }

        // Verify business exists
        const business = await Business.getById(businessId);
        if (!business) {
            return res.status(404).json({ error: "business doesn't exist" });
        }

        await Review.create(businessId, userId, rating, comment || null);
        res.json({ message: "review created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to create review" });
    }
});

module.exports = router;