// Function to create the chat box inside the overlay
function createChatBox() {
  if (document.getElementById('chatOverlay')) return;

  const chatBox = document.createElement('div');
  chatBox.id = 'chatOverlay';
  chatBox.style.position = 'fixed';
  chatBox.style.right = '20px';
  chatBox.style.bottom = '20px';
  chatBox.style.width = '300px';
  chatBox.style.height = '400px';
  chatBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  chatBox.style.color = 'white';
  chatBox.style.padding = '10px';
  chatBox.style.zIndex = '9999';
  chatBox.style.display = 'none';
  chatBox.style.boxSizing = 'border-box';
  chatBox.style.borderRadius = '8px';
  chatBox.style.fontSize = '12px';

  chatBox.innerHTML = `
    <div style="text-align: right; margin-bottom: 5px;">
    <button id="closeChatBox" style="background: transparent; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
    </div>
    <input type="text" id="questionInput" placeholder="Ask your question" 
    style="width: 100%; padding: 5px; margin-bottom: 5px; box-sizing: border-box; border-radius: 8px;">
    <button id="sendQuestionButton" style="width: 100%; padding: 5px; border-radius: 8px;">Send Question</button>
    <button id="screenshotButton" style="width: 100%; padding: 5px; margin-top: 8px; border-radius: 8px;">Take Screenshot</button>
    <div id="chatContent" style="margin-top: 8px; max-height: 150px; overflow-y: auto; border-top: 1px solid #ccc; padding-top: 5px;"></div>
  `;

  document.body.appendChild(chatBox);

  // Close button
  document.getElementById('closeChatBox').addEventListener('click', () => {
    chatBox.style.display = 'none';
  });

  // Send question
  document.getElementById('sendQuestionButton').addEventListener('click', () => {
    const question = document.getElementById('questionInput').value;
    if (question) {
      sendQuestionToBackend(question);
      document.getElementById('questionInput').value = ''; // Clear input
    }
  });

  // Screenshot
  document.getElementById('screenshotButton').addEventListener('click', takeScreenshot);
}

// Show the chat box when video plays
function showChatBox() {
  const chatBox = document.getElementById('chatOverlay');
  if (chatBox) chatBox.style.display = 'block';
}

// Hide the chat box
function hideChatBox() {
  const chatBox = document.getElementById('chatOverlay');
  if (chatBox) chatBox.style.display = 'none';
}

// Send question to backend
function sendQuestionToBackend(question) {
  const video = document.querySelector('video');
  const videoUrl = window.location.href;
  const timestamp = video ? video.currentTime : 0;

  const data = {
    question: question,
    videoUrl: videoUrl,
    timestamp: timestamp,
  };

  fetch('http://localhost:3000/ask-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    const chatContent = document.getElementById('chatContent');
    const formattedTime = formatTime(timestamp);

    const messageBlock = document.createElement('div');
    messageBlock.style.marginBottom = '8px';
    messageBlock.innerHTML = `
      <div><strong>You:</strong> ${question} <span style="float: right; color: #bbb;">[${formattedTime}]</span></div>
      <div><strong>Bot:</strong> ${data.answer}</div>
    `;

    chatContent.appendChild(messageBlock);
    chatContent.scrollTop = chatContent.scrollHeight; // auto-scroll
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Format time (seconds) to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Take a screenshot of video
function takeScreenshot() {
  const video = document.querySelector('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('screenshot', blob, 'screenshot.png');

    fetch('http://localhost:3000/upload-screenshot', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Screenshot uploaded:', data);
    })
    .catch(error => {
      console.error('Error uploading screenshot:', error);
    });
  });
}

// Initialize overlay
function setupChatOverlay() {
  if (!window.location.href.includes("youtube.com/watch")) {
    hideChatBox();
    return;
  }

  createChatBox();

  const checkInterval = setInterval(() => {
    const video = document.querySelector('video');
    if (video && !video.hasAttribute('data-overlay-set')) {
      video.setAttribute('data-overlay-set', 'true');

      video.addEventListener('play', showChatBox);
      video.addEventListener('pause', hideChatBox);
      video.addEventListener('ended', hideChatBox);

      if (!video.paused) {
        showChatBox();
      }

      clearInterval(checkInterval);
    }
  }, 500);
}

// Detect page changes (SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setupChatOverlay();
  }
}).observe(document, { subtree: true, childList: true });

// Initial load
window.addEventListener('load', () => {
  setupChatOverlay();
});
