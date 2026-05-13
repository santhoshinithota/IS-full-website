# Setup and Operations Guide

## Prerequisites

Install:

- Node.js 18 or newer.
- npm.
- MongoDB locally, or access to a MongoDB Atlas cluster.

Recommended local MongoDB URI:

```text
mongodb://127.0.0.1:27017/storytime
```

## First-Time Setup

From the project root:

```bash
bash scripts/install.sh
```

This installs dependencies in both:

```text
frontend/
backend/
```

Then create the backend environment file:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` and set:

```text
MONGO_URI=mongodb://127.0.0.1:27017/storytime
JWT_SECRET=use-a-long-random-secret
FRONTEND_URL=http://localhost:5173
PORT=5000
```

## Running the App Locally

### Option 1: One Command

From the project root:

```bash
bash scripts/run-local.sh
```

This starts:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Option 2: Two Terminals

Terminal 1:

```bash
cd backend
npm start
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Seeding Test Data

If MongoDB is running and `backend/.env` is configured:

```bash
cd backend
npm run seed
```

This creates:

- A default admin.
- A `BB Story` record in MongoDB.

The frontend can still run without seeding because it has the local fallback story.

## Common Development Commands

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
cd backend
npm start
npm run seed
```

## Important Local URLs

```text
Home:              http://localhost:5173
Story library:     http://localhost:5173/stories
Local BB Story:    http://localhost:5173/narration/local-bb-story
Admin login:       http://localhost:5173/admin
Backend API:       http://localhost:5000/api
```

## Git Ignore Policy

The root `.gitignore` ignores:

- `node_modules/`
- build output (`dist/`, `build/`)
- `.env` and `.env.*`
- logs
- OS/editor files
- `docs-2/`

Important: `.gitignore` only prevents new files from being tracked. If a secret file was already committed, remove it from git's index:

```bash
git rm --cached backend/.env
```

Then rotate any secrets that may have been exposed.

## MongoDB Storage Estimate

The current storage estimate from `Limitations.txt` says:

- About 1 MB per minute of recording.
- A maximum expected recording length of about 2 minutes.
- MongoDB free tier storage is about 512 MB.
- This gives roughly 250 recordings before storage pressure.

This is only an estimate. Real storage depends on browser audio format, bitrate, and recording length.

## Troubleshooting

### Backend says MongoDB connection error

Check:

- MongoDB is running.
- `MONGO_URI` is correct.
- Network access is enabled if using MongoDB Atlas.

### Frontend loads but no API data appears

Check:

- Backend is running on port `5000`.
- Vite proxy is active through `npm run dev`.
- Browser console has no failed `/api` requests.

If the API is down, the app should still show the local `BB Story`.

### Recording does not start

Check:

- Browser microphone permission is allowed.
- You are using `localhost` or HTTPS.
- The browser supports `MediaRecorder`.

### Recording does not upload

Check:

- Backend is running.
- MongoDB is connected.
- The `/api/recordings/upload` request is not failing in the browser network tab.

### Admin login fails

Check:

- You ran `npm run seed`.
- The seeded admin exists in MongoDB.
- The password in `backend/seed.js` matches what you are using.

## Production Checklist

Before using the app with real participant data:

- Change seeded admin credentials.
- Use a strong `JWT_SECRET`.
- Remove any tracked `.env` file from git.
- Protect all admin routes with JWT middleware.
- Set `NODE_ENV=production`.
- Set `FRONTEND_URL` to the deployed frontend origin.
- Use HTTPS.
- Confirm consent and ethics requirements for child voice recordings.
- Decide retention policy for recordings.
- Back up MongoDB or define a deletion/export workflow.

