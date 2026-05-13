# System Overview

## Purpose

This project is a research-oriented web platform for remote child narrative assessment and storytelling. It presents children with ordered picture prompts, records their spoken narration in the browser, and stores the audio plus metadata for later review by researchers, teachers, or administrators.

The platform is intended for multilingual child language research and educational use, especially where traditional in-person assessment is difficult. It supports a structured workflow: select a story, view one image at a time, narrate aloud, record the narration, and save it for analysis.

## Main Users

- **Child participant**: views picture prompts and narrates a story.
- **Parent / teacher / researcher**: helps administer the session using the on-screen instructions.
- **Admin / researcher**: logs into the dashboard to review, play, and delete recordings.

## High-Level Architecture

```text
Browser / React App
    |
    | /api requests through Vite proxy in development
    v
Express Backend API
    |
    | Mongoose
    v
MongoDB
    |
    | GridFS bucket for audio blobs
    v
Recording files + metadata
```

The frontend is responsible for the child-facing experience, story navigation, local fallback story loading, and browser audio recording. The backend is responsible for authentication, story APIs, recording metadata, and audio storage through MongoDB GridFS.

## Core Modules

### Frontend

The frontend is built with React, Vite, Tailwind CSS, React Router, axios, and lucide-react icons.

Primary routes:

- `/` - home screen and child name entry.
- `/stories` - story library.
- `/narration/:id` - picture-by-picture narration and recording page.
- `/admin` - admin login.
- `/admin/dashboard` - recording review dashboard.

### Backend

The backend is an Express application using Mongoose for MongoDB access. It exposes API routes under `/api`.

Primary route groups:

- `/api/admin` - admin login.
- `/api/stories` - story listing, reading, creation, updates, and deletion.
- `/api/recordings` - audio upload, listing, streaming, and deletion.

### Database

MongoDB stores:

- Admin accounts.
- Story definitions.
- Recording metadata.
- Recording audio files through GridFS.

## Built-In BB Story

The repository includes a built-in `BB Story` under `BB_story/`. It contains six single-panel images:

```text
BB_story/1.jpg
BB_story/2.jpg
BB_story/3.jpg
BB_story/4.jpg
BB_story/5.jpg
BB_story/6.jpg
```

The frontend imports these files in `frontend/src/data/localStories.js`, so the app can still show a usable story even if the backend or MongoDB is not running.

## Data Flow

1. The child opens the app and enters a name.
2. The frontend loads stories from the backend.
3. If the backend is unavailable, the frontend loads the local `BB Story`.
4. The child opens a story and views the images one by one.
5. The browser records the narration using `MediaRecorder`.
6. The recording is uploaded as `multipart/form-data`.
7. The backend writes the audio blob to GridFS.
8. The backend writes recording metadata to MongoDB.
9. The admin dashboard fetches recordings and streams audio for playback.

## Research Relevance

The system is designed around standardised picture-prompt presentation and repeatable administration. This makes the collected data more consistent than an informal storytelling app, because each participant can see the same image order, receive similar instructions, and produce audio that is linked to story and participant metadata.

