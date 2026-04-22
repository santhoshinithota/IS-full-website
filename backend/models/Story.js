const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: [{ type: String }],
    characters: { type: String },
    summary: { type: String },
    instructions: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
