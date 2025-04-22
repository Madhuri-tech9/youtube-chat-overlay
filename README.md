# YouTube Chat Overlay Chrome Extension

This Chrome Extension overlays a custom chat box on YouTube videos. Users can ask questions related to the video, capture screenshots of the video frame, and send data (video URL, timestamp, question) to a backend server.

## Features

- Chat box appears when a YouTube video plays.
- Automatically hides when paused or ended.
- Send question to backend with current timestamp and video URL.
- Take and upload screenshot of current video frame.

## How to Install the Extension

1. Open **Google Chrome**.
2. Go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked**.
5. Select the folder

## How to Use the Extension

1. Visit any YouTube video.
2. When the video starts playing:
   - A chat box will appear on screen.
3. Type a question in the input box and click **"Send Question"**.
   - It will send the question, video URL, and current timestamp to the backend.
4. Click **"Take Screenshot"** to capture the current frame and upload it.

## Backend Requirements

Ensure your backend server is running locally on:
http://localhost:3000

It should have the following endpoints:

- `POST /ask-question` – Accepts JSON with question, video URL, and timestamp.
- `POST /upload-screenshot` – Accepts a screenshot file via `multipart/form-data`.
