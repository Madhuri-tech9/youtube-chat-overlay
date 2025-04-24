# YouTube Chat Overlay Chrome Extension

This Chrome Extension overlays a custom chat box on YouTube videos. Users can ask questions related to the video, capture screenshots of the video frame, and send data (video URL, timestamp, question) to a backend server.

## Features

- **VN Icon**: A floating icon at the top-right corner to toggle the chat overlay visibility.
- **Chat Box**: A chat window at the bottom-right corner with the following features:
  - **Input field**: For asking questions.
  - **Send Question button**: Sends the question along with the current video URL and timestamp to the backend.
  - **Take Screenshot button**: Captures a screenshot of the video and sends it to the backend.
  - **Message Display**: Displays the user's question and the bot's response along with a clickable timestamp.
- **Screenshot Functionality**: Takes a screenshot of the video and appends it in the chat.
- **Timestamps**: Each message is timestamped, and clicking on a timestamp will jump to that part of the video.
- **Dynamic Setup**: The extension will dynamically initialize the overlay when the page URL changes.

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
