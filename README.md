# YouTube Overlay Extension
## Description
This Chrome extension overlays a floating window on YouTube videos, offering three main functionalities:

- **Q/A**: Ask a question related to the video and receive answers from a backend service.
- **Clip**: Capture video frames as images, add questions, and store answers.
- **Notes**: Write, save, and delete notes related to the video, and export them.

## Features

- Overlay chat window with **Q/A**, **Clip**, and **Notes** tabs.
- Real-time questions and answers integration with the backend.
- Screenshot capture for clips, including the ability to paste questions.
- Ability to save, delete, and export notes associated with YouTube videos.
- Persistent data storage for unsaved notes and questions using `localStorage`.
- Ability to send multiple clips with associated questions to the backend.

## Usage

1. Navigate to any YouTube video.
2. The extension overlay will appear with the **Q/A**, **Clip**, and **Notes** tabs.
3. In the **Q/A** tab:
   - Ask a question related to the video.
   - The question will be sent to the backend for an answer.
   - The answer will be displayed in the corresponding field.
4. In the **Clip** tab:
   - Capture a screenshot of the video at the current timestamp.
   - Add a question about the screenshot.
   - Save or send the clip data to the backend.
5. In the **Notes** tab:
   - Write and save notes related to the video.
   - Export notes in CSV format.

## How to Use

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right).
3. Click **Load Unpacked**.
4. Select your project folder.

## Backend Requirement

The Q/A feature requires a local server running at: http://localhost:5000/ask