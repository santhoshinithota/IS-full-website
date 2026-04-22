const express = require('express');
const router = express.Router();
const Recording = require('../models/Recording');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST upload recording
router.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        const { childName, storyId, storyName, duration } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        await new Promise((resolve, reject) => {
            const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'recordings'
            });

            const uploadStream = gridFSBucket.openUploadStream(`${Date.now()}-${req.file.originalname}`, {
                contentType: req.file.mimetype
            });

            uploadStream.end(req.file.buffer);

            uploadStream.on('finish', async () => {
                try {
                    const newRecording = new Recording({
                        childName,
                        storyId,
                        storyName,
                        duration,
                        fileId: uploadStream.id,
                    });

                    await newRecording.save();
                    res.status(201).json(newRecording);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            uploadStream.on('error', (err) => {
                reject(err);
            });
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all recordings (Admin dashboard)
router.get('/', async (req, res) => {
    try {
        const recordings = await Recording.find().sort({ date: -1 });
        res.json(recordings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET audio stream by fileId
router.get('/audio/:id', async (req, res) => {
    try {
        const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'recordings'
        });

        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const downloadStream = gridFSBucket.openDownloadStream(fileId);

        // We can set default content type to audio/webm or audio/wav
        res.set('Content-Type', 'audio/webm');
        downloadStream.pipe(res);

        downloadStream.on('error', () => {
            res.status(404).json({ error: 'Audio file not found' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE recording
router.delete('/:id', async (req, res) => {
    try {
        const recording = await Recording.findById(req.params.id);
        if (!recording) {
            return res.status(404).json({ error: 'Recording not found' });
        }

        // Delete from GridFS
        const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'recordings'
        });
        await gridFSBucket.delete(recording.fileId);

        // Delete metadata
        await Recording.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recording deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
