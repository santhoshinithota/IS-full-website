const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    childName: { type: String, required: true },
    /** String so built-in routes like `local-bb-story` and Mongo ObjectIds both work. */
    storyId: { type: String, required: true },
    storyName: { type: String, required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS file ID
    date: { type: Date, default: Date.now },
    duration: { type: Number }
});

module.exports = mongoose.model('Recording', recordingSchema);
