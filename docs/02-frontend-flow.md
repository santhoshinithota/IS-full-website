# Frontend Flow

## Frontend Stack

The frontend lives in `frontend/` and uses:

- React 19
- Vite
- Tailwind CSS
- React Router
- axios
- lucide-react

The app entry route configuration is in `frontend/src/App.jsx`.

## Main Pages

### Home Page

File: `frontend/src/pages/Home.jsx`

The home page is the starting point for the child-facing flow. It lets the child or administrator enter the child's name. The name is saved in `localStorage` as `childName` and reused later during narration and recording upload.

Main actions:

- Enter child name.
- Continue to the story library.
- Continue as guest.
- Navigate to admin login.

### Story Selection Page

File: `frontend/src/pages/StorySelection.jsx`

The story selection page loads available stories using `fetchStoriesList()` from `frontend/src/utils/storyLoader.js`.

It displays each story as a card:

- Story cover image.
- Story title.
- Short summary.
- Click action to open `/narration/:id`.

The story cover is the first image in the story's `images` array.

### Narration Page

File: `frontend/src/pages/Narration.jsx`

The narration page is the main research interaction screen. It loads a single story using `fetchStoryById()` and presents story images one by one.

Main features:

- Page counter, such as `Page 1 / 6`.
- Centered main image viewer.
- Previous and next buttons.
- Thumbnail strip for direct navigation.
- Full-screen image zoom.
- Recording instructions modal.
- Audio recording component at the bottom.
- Post-recording summary and success screens.

The currently shown image is controlled by `currentIndex`. The page uses `images[currentIndex]` to render the active picture.

### Admin Login Page

File: `frontend/src/pages/AdminLogin.jsx`

This page sends admin credentials to the backend login endpoint. On success, the returned JWT is stored in `localStorage` as `adminToken`.

### Admin Dashboard

File: `frontend/src/pages/AdminDashboard.jsx`

The dashboard displays uploaded recordings. It lets an admin:

- View recording metadata.
- Play audio recordings.
- Delete recordings.

Audio playback uses the backend streaming route:

```text
/api/recordings/audio/:fileId
```

## Story Loading Logic

File: `frontend/src/utils/storyLoader.js`

The frontend first tries to load stories from the backend API. If the API is not reachable, it falls back to local stories from `frontend/src/data/localStories.js`.

This gives the app a useful offline/demo mode:

- Backend running: use MongoDB stories plus local fallback if needed.
- Backend not running: use local `BB Story`.

## Local Story Data

File: `frontend/src/data/localStories.js`

The local story imports the six BB Story panels directly:

```js
import page1 from '../../../BB_story/1.jpg?url';
import page2 from '../../../BB_story/2.jpg?url';
import page3 from '../../../BB_story/3.jpg?url';
import page4 from '../../../BB_story/4.jpg?url';
import page5 from '../../../BB_story/5.jpg?url';
import page6 from '../../../BB_story/6.jpg?url';
```

The story object uses:

```js
images: [page1, page2, page3, page4, page5, page6]
```

That is why `/narration/local-bb-story` shows the single images one by one.

## API Client

File: `frontend/src/utils/api.js`

The axios client uses:

- `/api` in development, relying on the Vite proxy.
- `VITE_API_URL` if provided.
- `http://localhost:5000/api` as a production fallback.

It also attaches `adminToken` from `localStorage` to requests:

```text
Authorization: Bearer <token>
```

## Audio Recorder

File: `frontend/src/components/AudioRecorder.jsx`

The recorder uses the browser `MediaRecorder` API. It supports:

- Start recording.
- Stop recording.
- Preview recorded audio.
- Re-record.
- Upload recording.

When uploading, it sends `multipart/form-data` to:

```text
POST /api/recordings/upload
```

The request includes:

- `audio` file blob.
- `childName`.
- `storyId`.
- `storyName`.
- `duration`.

## Development Proxy

File: `frontend/vite.config.js`

During local development, Vite proxies API calls:

```text
/api -> http://127.0.0.1:5000
```

Because of this, frontend code can call `/api/stories` without worrying about CORS or hard-coded backend URLs during development.

