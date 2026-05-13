const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// Get all stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find().sort({ title: 1 });
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get story by ID
router.get('/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json(story);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Create new story
router.post('/', async (req, res) => {
    try {
        const newStory = new Story(req.body);
        await newStory.save();
        res.status(201).json(newStory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Admin: Update story
router.put('/:id', async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json(story);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Admin: Delete story
router.delete('/:id', async (req, res) => {
    try {
        const story = await Story.findByIdAndDelete(req.params.id);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json({ message: 'Story deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
