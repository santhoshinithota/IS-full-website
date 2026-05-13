const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/admin');
const storyRoutes = require('./routes/stories');
const recordingRoutes = require('./routes/recordings');

const app = express();

const defaultBrowserOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const extraOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultBrowserOrigins, ...extraOrigins])];

const isProduction = process.env.NODE_ENV === 'production';

app.use(
  cors({
    // In production, only listed origins. In dev, reflect any Origin so LAN / HTTPS / [::1] / tunnels work.
    // callback(null, false) becomes HTTP 403 "Forbidden" — that was breaking some local setups.
    origin: isProduction
      ? (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          console.warn('[CORS] Blocked origin:', origin);
          return callback(null, false);
        }
      : true,
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/admin', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/recordings', recordingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
});
