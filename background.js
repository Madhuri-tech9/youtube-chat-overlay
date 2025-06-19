// Store last active video URL to check for changes
let lastVideoUrl = '';

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkVideoChange') {
    const currentUrl = window.location.href;

    if (currentUrl !== lastVideoUrl) {
      lastVideoUrl = currentUrl;
      sendResponse({ videoChanged: true });
    } else {
      sendResponse({ videoChanged: false });
    }
  }
});

// Respond to events triggered by popup or overlay
chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === 'overlayPort');
  
  port.onMessage.addListener((msg) => {
    if (msg.action === 'saveClip') {
      // Handle saving clip data
      saveClipData(msg.clip);
    }
    if (msg.action === 'sendQuestion') {
      // Handle sending question to backend
      sendQuestionToBackend(msg.payload);
    }
    if (msg.action === 'saveNote') {
      // Handle saving notes
      saveNotes(msg.note);
    }
  });
});

// Function to handle saving clip data (to storage or backend)
function saveClipData(clip) {
  // Logic to save clip (e.g., local storage, backend, etc.)
  console.log('Clip saved:', clip);
}

// Function to handle sending question to the backend
async function sendQuestionToBackend(payload) {
  try {
    const response = await fetch('http://127.0.0.1:8000/app1/ask-question/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Answer:', data.answer);
  } catch (error) {
    console.error('Error sending question:', error);
  }
}

// Function to handle saving notes
async function saveNotes(note) {
  try {
    const response = await fetch('http://127.0.0.1:8000/app1/ask-question/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      console.log('Note saved successfully!');
    } else {
      console.error('Failed to save note');
    }
  } catch (error) {
    console.error('Error saving note:', error);
  }
}


