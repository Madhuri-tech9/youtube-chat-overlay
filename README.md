# YouTube Overlay Extension
This project adds a custom overlay with a VN button on YouTube video pages.
The overlay provides three functionalities via tabs: Q/A, Clip, and Notes.

## Features
- Floating VN Button:
Appears when watching YouTube videos. Clicking it toggles the overlay.

Overlay Sections:
1. Q/A Tab:
Ask a question and fetch an answer from a server (e.g., localhost:5000).
2. Clip Tab:
Input and analyze short clips (UI only; backend integration needed).
3. Notes Tab:
Create, save, delete, and export personal notes. Notes are stored in localStorage.
- Auto Detects YouTube Watch Pages:
- The button and overlay automatically appear only on youtube.com/watch URLs.

## Installation

1. Clone or download the project.
2. If using as a Chrome Extension:
- Open Chrome and go to chrome://extensions/.
- Enable Developer mode (top right).
- Click Load unpacked.
- Select your project folder.
3. If directly injecting into a website for testing:
- Copy-paste the JavaScript into the console while on a YouTube video page.

## API Requirement

- Q/A feature expects a backend running at:
http://localhost:5000/ask