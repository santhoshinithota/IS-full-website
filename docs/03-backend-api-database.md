# Backend, API, and Database

## Backend Stack

The backend lives in `backend/` and uses:

- Node.js
- Express
- Mongoose
- MongoDB
- GridFS
- Multer
- JWT
- bcryptjs
- dotenv

The main entrypoint is:

```text
backend/server.js
```

## Server Startup

`server.js` does the following:

1. Loads environment variables using `dotenv`.
2. Creates an Express app.
3. Configures CORS.
4. Enables JSON request parsing.
5. Mounts API routes.
6. Starts listening on `PORT`.
7. Connects to MongoDB using `MONGO_URI`.

Default port:

```text
5000
```

## Environment Variables

Defined in `backend/env.example`:

```text
MONGO_URI=mongodb://127.0.0.1:27017/storytime
JWT_SECRET=change-this-to-a-long-random-string
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Create a local environment file:

```bash
cp backend/env.example backend/.env
```

Do not commit `.env` files.

## Route Groups

The backend mounts:

```text
/api/admin       -> backend/routes/admin.js
/api/stories     -> backend/routes/stories.js
/api/recordings  -> backend/routes/recordings.js
```

## Admin API

### POST `/api/admin/login`

Authenticates an admin.

Request:

```json
{
  "username": "admin-name",
  "password": "admin-password"
}
```

Response:

```json
{
  "token": "jwt-token"
}
```

The token expires in one day. The frontend stores it in `localStorage` as `adminToken`.

## Stories API

### GET `/api/stories`

Returns all stories sorted by title.

### GET `/api/stories/:id`

Returns one story by MongoDB ObjectId.

### POST `/api/stories`

Creates a new story.

Expected body:

```json
{
  "title": "Story title",
  "images": ["image-url-1", "image-url-2"],
  "characters": "optional characters",
  "summary": "optional summary",
  "instructions": "optional instructions"
}
```

### PUT `/api/stories/:id`

Updates a story.

### DELETE `/api/stories/:id`

Deletes a story.

## Recordings API

### POST `/api/recordings/upload`

Uploads one audio recording.

Content type:

```text
multipart/form-data
```

Fields:

- `audio` - recorded audio blob.
- `childName` - child or participant name.
- `storyId` - story id.
- `storyName` - story title.
- `duration` - recording length in seconds.

Processing flow:

1. Multer reads the uploaded audio into memory.
2. GridFSBucket opens an upload stream.
3. The audio buffer is written to MongoDB GridFS.
4. A `Recording` document is created with the GridFS `fileId`.

### GET `/api/recordings`

Returns all recording metadata sorted by newest first.

### GET `/api/recordings/audio/:id`

Streams the audio file from GridFS.

The `:id` parameter is the `fileId` stored on a `Recording` document.

### DELETE `/api/recordings/:id`

Deletes:

1. The recording metadata document.
2. The matching audio file from GridFS.

## MongoDB Models

### Admin

File: `backend/models/Admin.js`

Fields:

```js
{
  username: String,
  password: String
}
```

Passwords are hashed with bcrypt before saving.

### Story

File: `backend/models/Story.js`

Fields:

```js
{
  title: String,
  images: [String],
  characters: String,
  summary: String,
  instructions: String,
  createdAt: Date
}
```

### Recording

File: `backend/models/Recording.js`

Fields:

```js
{
  childName: String,
  storyId: String,
  storyName: String,
  fileId: ObjectId,
  date: Date,
  duration: Number
}
```

`storyId` is stored as a string so both MongoDB story IDs and the local fallback ID (`local-bb-story`) can work.

## GridFS Storage

Audio files are stored in a MongoDB GridFS bucket named:

```text
recordings
```

MongoDB creates these collections:

```text
recordings.files
recordings.chunks
```

The `Recording` document stores only metadata plus `fileId`. The actual audio bytes live in GridFS.

## Seed Script

File: `backend/seed.js`

Run:

```bash
cd backend
npm run seed
```

The seed script creates:

- One default admin user.
- One `BB Story` document if it does not already exist.

The default credentials in the current seed script should be changed before any real deployment.

## Security Notes

The backend has JWT login, but some admin-style routes still need route protection middleware before production use.

Routes that should be protected:

- Story create/update/delete.
- Recording list.
- Recording delete.
- Possibly audio streaming, depending on consent and privacy requirements.

Recommended production middleware:

```text
Authorization: Bearer <jwt>
```

The middleware should verify the JWT using `JWT_SECRET` and reject invalid or missing tokens.

