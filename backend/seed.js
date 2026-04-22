const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Story = require('./models/Story');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected for seeding');

        // Seed Admin
        const adminExists = await Admin.findOne({ username: 'Santhuthota' });
        if (!adminExists) {
            const admin = new Admin({ username: 'Santhuthota', password: 'Iamafool@123' });
            await admin.save();
            console.log('Admin seeded');
        } else {
            console.log('Admin already exists');
        }

        // Seed BB_story
        const storyExists = await Story.findOne({ title: 'BB Story' });
        if (!storyExists) {
            const story = new Story({
                title: 'BB Story',
                images: ['/assets/BB_story/1.jpg', '/assets/BB_story/2.jpg', '/assets/BB_story/3.jpg', '/assets/BB_story/4.jpg', '/assets/BB_story/5.jpg', '/assets/BB_story/6.jpg'],
                summary: 'A story uploaded via the proposal assets.',
            });
            await story.save();
            console.log('BB Story seeded');
        } else {
            console.log('BB Story already exists');
        }

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
