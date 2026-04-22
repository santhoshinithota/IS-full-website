const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    childName: { type: String, required: true },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    storyName: { type: String, required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS file ID
    date: { type: Date, default: Date.now },
    duration: { type: Number }
});

module.exports = mongoose.model('Recording', recordingSchema);
