// Function to reset chat content
function resetChatBox() {
  const chatBox = document.getElementById('chatOverlay');
  const chatContent = document.getElementById('chatContent');
  if (chatBox && chatContent) {
    chatContent.innerHTML = ''; // Clear all chat messages
  }
}

// Function to create the VN icon inside the overlay
function createVNIcon() {
  if (document.getElementById('vnIcon')) return;

  const vnIcon = document.createElement('div');
  vnIcon.id = 'vnIcon';
  vnIcon.style.position = 'fixed';
  vnIcon.style.right = '20px';
  vnIcon.style.top = '20px';
  vnIcon.style.padding = '10px';
  vnIcon.style.backgroundColor = '#ff0000';
  vnIcon.style.color = 'white';
  vnIcon.style.borderRadius = '50%';
  vnIcon.style.cursor = 'pointer';
  vnIcon.style.zIndex = '9999';
  vnIcon.style.fontSize = '18px';
  vnIcon.style.display = 'flex';
  vnIcon.style.alignItems = 'center';
  vnIcon.style.justifyContent = 'center';
  vnIcon.innerHTML = 'VN';

  document.body.appendChild(vnIcon);

  vnIcon.addEventListener('click', () => {
    const chatBox = document.getElementById('chatOverlay');
    if (chatBox) {
      chatBox.style.display = chatBox.style.display === 'block' ? 'none' : 'block';
    }
  });
}

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

  document.getElementById('closeChatBox').addEventListener('click', () => {
    chatBox.style.display = 'none';
  });

  document.getElementById('sendQuestionButton').addEventListener('click', () => {
    const question = document.getElementById('questionInput').value;
    if (question) {
      sendQuestionToBackend(question);
      // Do not clear the input field so previous questions stay there
    }
  });

  document.getElementById('screenshotButton').addEventListener('click', takeScreenshot);
}

// Send question to backend and display it along with the answer
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

      // Create the message block for the question and bot's answer
      const messageBlock = document.createElement('div');
      messageBlock.style.marginBottom = '8px';
      messageBlock.innerHTML = `
        <div><strong>You:</strong> ${question} 
          <span class="timestamp" data-time="${timestamp}" style="float: right; color: #bbb; cursor: pointer; text-decoration: underline;">[${formattedTime}]</span>
        </div>
        <div><strong>Bot:</strong> ${data.answer}</div>
      `;

      // Append the message block to chat content (doesn't clear previous messages)
      chatContent.appendChild(messageBlock);
      chatContent.scrollTop = chatContent.scrollHeight;
      addTimestampListeners();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Take a screenshot of video and show in chat box
function takeScreenshot() {
  const video = document.querySelector('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const timestamp = video ? video.currentTime : 0;
  const formattedTime = formatTime(timestamp);
  const chatContent = document.getElementById('chatContent');

  const screenshotImage = new Image();
  screenshotImage.src = canvas.toDataURL('image/png');
  screenshotImage.style.maxWidth = '100%';
  screenshotImage.style.borderRadius = '4px';
  screenshotImage.style.marginTop = '5px';

  const messageBlock = document.createElement('div');
  messageBlock.style.marginBottom = '10px';
  messageBlock.innerHTML = `
    <div><strong>You:</strong> Screenshot taken 
      <span class="timestamp" data-time="${timestamp}" style="float: right; color: #bbb; cursor: pointer; text-decoration: underline;">[${formattedTime}]</span>
    </div>
  `;
  messageBlock.appendChild(screenshotImage);
  chatContent.appendChild(messageBlock);
  chatContent.scrollTop = chatContent.scrollHeight;
  addTimestampListeners();

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('screenshot', blob, 'screenshot.png');
    formData.append('videoUrl', window.location.href);
    formData.append('timestamp', timestamp);

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

// Format time (seconds) to MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Make timestamps clickable
function addTimestampListeners() {
  const timestamps = document.querySelectorAll('.timestamp');
  timestamps.forEach(span => {
    span.addEventListener('click', () => {
      const time = parseFloat(span.dataset.time);
      const video = document.querySelector('video');
      if (video && !isNaN(time)) {
        video.currentTime = time;
        video.play();
      }
    });
  });
}

// Setup overlay when video is ready
function setupChatOverlay() {
  const video = document.querySelector('video');
  if (!video) return;

  resetChatBox();
  createVNIcon();
  createChatBox();

  video.addEventListener('pause', () => {
    const chatBox = document.getElementById('chatOverlay');
    if (chatBox) chatBox.style.display = 'block';
  });

  video.addEventListener('ended', () => {
    const chatBox = document.getElementById('chatOverlay');
    if (chatBox) chatBox.style.display = 'none';
  });
}

// Watch for URL/video changes
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    setupChatOverlay();
  }
});

observer.observe(document, { subtree: true, childList: true });

// Initial load setup
window.addEventListener('load', setupChatOverlay);




