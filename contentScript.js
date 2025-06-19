(function () {
    let overlay = null;
    let qboxaiButton = null;
    let lastUrl = location.href;
    
    // Function to show a temporary on-screen notification
    function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerText = message;
    // Apply styles to position and style the notification box
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        z-index: 10001;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    `;
    document.body.appendChild(notification);
    // Automatically fade out after 2.5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
    // Remove the element from DOM after fade-out completes
        setTimeout(() => notification.remove(), 500);
    }, 2500);
}

    // Function to create the VN button and add it to the page
    function createQBOXAIButton() {
        qboxaiButton = document.createElement('button');
        qboxaiButton.id = 'qboxai-button';
        qboxaiButton.innerHTML = 'Q<br>B<br>O<br>X<br>A<br>I';
        qboxaiButton.style.cssText = `
    position: fixed;
    top: 100px;
    right: 0px; /* Changed from 20px to 0px to touch right edge */
    z-index: 9999;
    background: #FFEB3B;
    color: black;
    font-weight: bold;
    border: 2px solid black;
    border-radius: 12px 0 0 12px; /* Rounded only on left side */
    padding: 6px 4px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 0 6px rgba(0,0,0,0.4);
`;

        document.body.appendChild(qboxaiButton);
    // Add click event listener to handle showing/hiding overlay and login box
        qboxaiButton.addEventListener('click', () => {

    // If overlay is visible, hide overlay and login box (toggle off)
    if (overlay && overlay.style.display === 'block') {
        overlay.style.display = 'none';
        document.getElementById('login-box').style.display = 'none';
        return;
    }

    const storedEmail = localStorage.getItem('qboxai-email');

      if (storedEmail) {
    // User is logged in
    document.getElementById('login-box').style.display = 'none';
    overlay.style.display = 'block';

    const video = document.querySelector('video');
    if (video) video.play();
    return;
    } else {
    // Not logged in
    const loginBox = document.getElementById('login-box');
    if (loginBox) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        loginBox.style.display = 'block';
    }

    const video = document.querySelector('video');
    if (video) video.pause();

    toggleOverlay();
}
        });
    }
    
    function createOverlay() {
    // Create the main overlay container
        overlay = document.createElement('div');
        overlay.id = 'my-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 130px;
            right: 20px;
            width: 320px;
            height: 500px;
            background: #000000;  
            border: 2px solid #FFEB3B;
            border-radius: 15px;
            z-index: 10000;
            padding: 12px;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            display: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
        `;
        document.body.appendChild(overlay);

    // Create and style the header section inside overlay
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            background: black;
            color: #FFEB3B;
            padding: 8px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 18px;
        `;
        header.innerHTML = '<span>QBOXAI</span>';
        overlay.appendChild(header);
    // Create Logout button with styling and positioning inside overlay
            const logoutBtn = document.createElement('button');
            logoutBtn.innerText = 'Logout';
            logoutBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 12px;
        background: #FFEB3B;
        color: black;
        font-weight: bold;
        border: 2px solid black;
        border-radius: 12px;
        padding: 4px 10px;
        cursor: pointer;
        font-size: 12px;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
    `;
    // Logout button click event: clear stored login, hide overlay and login box, alert user
        logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('qboxai-email');
        localStorage.removeItem('qboxai-access-token');
        localStorage.removeItem('qboxai-refresh-token');
  
        overlay.style.display = 'none';
        document.getElementById('login-box').style.display = 'none';
        showNotification('Logged out! Click QBOXAI button to login again.');
    });
    overlay.appendChild(logoutBtn);
    // Container div for tab content inside overlay
        const tabContent = document.createElement('div');
        tabContent.id = 'tabContent';
        tabContent.style.marginTop = '10px';
        overlay.appendChild(tabContent);
    // Container for tab buttons at bottom center of overlay
        const tabButtons = document.createElement('div');
        tabButtons.style.cssText = `
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            background: black;
            padding: 8px 10px;
            border-radius: 30px;
        `;
        createLoginBox();

        function createLoginBox() {
    // Create the login box container
        const loginBox = document.createElement('div');
        loginBox.id = 'login-box';
        loginBox.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 10px;
            border: 2px solid #FFEB3B;
            border-radius: 8px;
            z-index: 10001;
            display: none;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
            width: 200px;
            font-size: 13px;
            text-align: center;
        `;
    // Insert HTML content: heading, email & password inputs, error message div, and submit button
       loginBox.innerHTML = `
    <h4 style="margin: 0 0 8px;">Login</h4>

    <input id="email" type="text" placeholder="Email"
        style="width: 100%; height: 28px; margin-bottom: 6px; font-size: 13px; padding: 4px 8px; box-sizing: border-box;" />

    <div id="email-error" style="color: red; font-size: 10px; height: 14px; margin-bottom: 6px;"></div>

    <div style="position: relative; width: 100%; margin-bottom: 8px;">
        <input id="password" type="password" placeholder="Password"
            style="width: 100%; height: 28px; font-size: 13px; padding: 4px 30px 4px 8px; box-sizing: border-box;" />
        <span id="toggle-password"
            style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 14px;">
            👁️
        </span>
    </div>

    <button id="login-submit"
        style="width: 60%; padding: 6px; background: #FFEB3B; border: none; font-weight: bold; cursor: pointer;">
        Submit
    </button>
`;

    // Append the login box to the document body
        document.body.appendChild(loginBox);
        // ✅ Add password toggle event listener AFTER loginBox is added to DOM
    const toggleIcon = document.getElementById('toggle-password');
    toggleIcon.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleIcon.textContent = isPassword ? '🙈' : '👁️'; 
});

    // Add click event listener to the Submit button
        document.getElementById('login-submit').addEventListener('click', () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('email-error');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        document.getElementById('toggle-password').addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
});

    // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate email format
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.focus();
            return;
        } else {
            emailError.textContent = '';
        }
    // Check if password is empty
        if (password === '') {
        showNotification('Password cannot be empty', 'error');
        passwordInput.focus();
        return;
    }

    // Send login POST request to backend with email and password
        fetch('http://127.0.0.1:8000/users/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then(response => response.json())
        .then(data => {
    // On successful login, store tokens and username locally
        if (data.access && data.refresh) {
            localStorage.setItem('qboxai-access-token', data.access);
            localStorage.setItem('qboxai-refresh-token', data.refresh);
            localStorage.setItem('qboxai-email', data.user.email || email);
       
    // Hide login box and show the overlay
            document.getElementById('login-box').style.display = 'none';
            overlay.style.display = 'block';
    // Resume playing video if any
            const video = document.querySelector('video');
            if (video) video.play();
        } else {
    // Show error message from server or generic message
            showNotification(data.message || 'Login failed. Please check your credentials.', 'error');
        }
    })
            .catch(error => {
            console.error('Login error:', error);
            showNotification('Login request failed. Try again later.', 'error');
        });
    });
     }
    // Define tab names
        const tabs = ['Q/A', 'clip', 'notes'];
    // Create and style a button for each tab
        tabs.forEach(tab => {
        const button = document.createElement('button');
        button.innerText = tab;
    // Set different styles for active vs. inactive tab
            button.style.cssText = `
                background: ${tab === 'Q/A' ? '#FFEB3B' : 'black'};
                color: ${tab === 'Q/A' ? 'black' : 'white'};
                padding: 6px 14px;
                border: 2px solid #FFEB3B;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
                font-size: 12px;
            `;
            button.id = `${tab}-button`;
    // Add click event to switch tab content
            button.addEventListener('click', () => switchTab(tab));
    // Append the tab button to the tab button container
            tabButtons.appendChild(button);
        });
    // Append the tab button section to the overlay
        overlay.appendChild(tabButtons);
    // Set initial active tab to 'Q/A'
        switchTab('Q/A');
    }
    // Toggle the overlay visibility
        function toggleOverlay() {
        if (!overlay) return;
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    }
    // Remove overlay and VN button from DOM and reset variables
        function removeOverlayAndButton() {
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
        if (qboxaiButton) {
            qboxaiButton.remove();
            qboxaiButton = null;
            const loginBox = document.getElementById('login-box');
        if (loginBox) loginBox.remove();

        }
    }
    // Checks if current URL is a YouTube video, and injects or removes elements accordingly
        function checkAndInject() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('youtube.com/watch')) {
        // Clean up any previous overlay and button
         removeOverlayAndButton();
        // Clear saved notes from localStorage (to reset for new video)
            localStorage.removeItem('notes');
        // Create new button and overlay
            createQBOXAIButton();
            createOverlay();
        } else {
        // Remove components if not on a YouTube video page
            removeOverlayAndButton();
        }
    }
    // Track last visited video URL to detect changes
        let lastVideoUrl = window.location.href; 
    // Handles switching between 'Q/A', 'clip', and 'notes' tabs
        function switchTab(tabName) {
        const tabContentDiv = document.getElementById('tabContent');
    // Highlight the active tab and reset styles of inactive ones
    
    // Change the tab styles based on the active tab
        document.querySelectorAll('#my-overlay button').forEach(btn => {
            if (['Q/A', 'clip', 'notes'].includes(btn.innerText)) {
                btn.style.background = btn.innerText.toLowerCase() === tabName.toLowerCase() ? '#FFEB3B' : 'black';
                btn.style.color = btn.innerText.toLowerCase() === tabName.toLowerCase() ? 'black' : 'white';
            }
        });
        // If user navigated to a new video, clear old data
            if (window.location.href !== lastVideoUrl) {
            localStorage.removeItem('savedQuestion');
            localStorage.removeItem('savedAnswer')
            lastVideoUrl = window.location.href; 
        }
        
        if (tabName.toLowerCase() === 'q/a') {
        // Retrieve saved question and answer from localStorage (if any)
            const savedQuestion = localStorage.getItem('savedQuestion') || '';
            const savedAnswer = localStorage.getItem('savedAnswer') || '';
        // Inject Q/A tab content with question textarea, send button, and answer display box
            tabContentDiv.innerHTML = `
                <textarea id="questionInput" placeholder="Ask your question here..." style="width:100%;height:60px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
                <div style="display:flex;justify-content:flex-end;margin-top:8px;">
                    <button id="sendQuestionBtn" style="background:#FFEB3B;color:black;padding:6px 14px;font-weight:bold;border:2px solid black;border-radius:8px;font-size:12px;cursor:pointer;">Send</button>
                </div>
                <div id="timestampContainer" style="margin-top:10px;"></div>
                <h4>Answer:</h4>
                <textarea id="answerOutput" placeholder="Answer" readonly style="width:100%;height:80px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
            `;

        // Reference the question input and answer box elements
            const questionInput = document.getElementById('questionInput');
            const answerBox = document.getElementById('answerOutput');
        // Restore previously typed question and answer (if available)
            questionInput.value = savedQuestion;
            answerBox.value = savedAnswer;
    
        // Save question to localStorage as the user types
            questionInput.addEventListener('input', () => {
            localStorage.setItem('savedQuestion', questionInput.value);
        });
    
        // Handle send button click: send question to backend and show response
           document.getElementById('sendQuestionBtn').addEventListener('click', async () => {
           const question = questionInput.value.trim();
        if (!question) {
        showQANotification('Please enter a question!', true);
        return;
        }
        // Get current video timestamp
            const video = document.querySelector('video');
            const videoId = new URLSearchParams(window.location.search).get("v");
            const videoUrl = `https://youtu.be/${videoId}`;
            const timestampInSeconds = video ? Math.floor(video.currentTime) : null;
        // Format timestamp as mm:ss
            const minutes = Math.floor(timestampInSeconds / 60);
            const seconds = timestampInSeconds % 60;
            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Add clickable timestamp link
            const timestampContainer = document.getElementById('timestampContainer');
        if (timestampContainer && timestampInSeconds !== null) {
            timestampContainer.innerHTML = '';

            const timestampLink = document.createElement('div');
            timestampLink.textContent = `⏱️ ${formattedTime}`;
            timestampLink.style.cssText = `
                color: #1976D2;
                font-weight: bold;
                cursor: pointer;
                text-decoration: underline;
                margin-bottom: 6px;
            `;

            timestampLink.addEventListener('click', () => {
        if (video) {
            video.currentTime = timestampInSeconds;
            video.scrollIntoView({ behavior: 'smooth', block: 'center' });
            video.focus();
        }
    });

            timestampContainer.appendChild(timestampLink);
        }

       // Prepare payload for API request
            const payload = {
            youtube_video_url: videoUrl,
            question: question,
            time_stamp: formattedTime
        };
        // Get JWT token from localStorage
            const token = localStorage.getItem('qboxai-access-token');
        try {
             answerBox.value = 'Loading...';
        // Send POST request to backend
            const response = await fetch('http://127.0.0.1:8000/app1/ask-question/', {
            method: 'POST',
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
        },
            body: JSON.stringify(payload),
            mode: 'cors'
    });
            const data = await response.json();
        // Display the answer or fallback message
           if (data.success && data.data && data.data.answer) {
    answerBox.value = data.data.answer;
    localStorage.setItem('savedAnswer', answerBox.value);
} else {
    const backendMessage = data.message || 'Something went wrong.';
    answerBox.value = backendMessage;
    localStorage.setItem('savedAnswer', backendMessage);
    showQANotification(backendMessage, true);
}

    } catch (error) {
        console.error(error);
        answerBox.value = 'Error getting answer.';
    }
});
        // Clear saved data when a new video is loaded   
                const videoElement = document.querySelector('video');
                if (videoElement) {
                videoElement.addEventListener('loadeddata', () => {
                    localStorage.removeItem('savedQuestion');
                    localStorage.removeItem('savedAnswer');
                    questionInput.value = '';
                    answerBox.value = ''; 
                });
            }
        // Detect video change using video ID to reset related data
                const currentVideoId = new URLSearchParams(window.location.search).get("v");
                if (!window.lastVideoId || window.lastVideoId !== currentVideoId) {
                window.lastVideoId = currentVideoId;
                window.clipData = []; 
            }
            

        }   else if (tabName.toLowerCase() === 'clip') {
            // Inject UI for Clip tab
            tabContentDiv.innerHTML = `
                <div id="clipContent" style="width:100%;min-height:120px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow:auto;background:white;"></div>
                <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;flex-wrap:wrap;">
                    <button id="sendBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Send</button>
                    <button id="screenshotBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Screenshot</button>
                </div>
                <div id="backendReply" style="margin-top:10px;padding:8px;background:#e0f7fa;border-radius:6px;display:none;"></div>
            `;
        // Reference UI elements
            const clipContentDiv = document.getElementById('clipContent');
            const screenshotBtn = document.getElementById('screenshotBtn');
            const sendBtn = document.getElementById('sendBtn');

        // Initialize global clipData array if not present
            if (!window.clipData) window.clipData = [];
        
        // Save current clips to window.clipData & localStorage
            const saveClipData = () => {
            const currentUrl = window.location.href;
            window.clipData = [...document.querySelectorAll('#clipContent > div')].map(container => {
            const img = container.querySelector('img');
            const question = container.querySelector('textarea:not([readonly])').value;
            const answer = container.querySelector('textarea[readonly]').value;
            const timestamp = container.getAttribute('data-timestamp') || 0;
            return { image: img.src, question, answer, timestamp };
        });

            chrome.storage.local.set({ 
            clipData: window.clipData, 
            clipVideoUrl: currentUrl 
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving clip data:', chrome.runtime.lastError);
        } else {
            console.log('Clip data saved for video:', currentUrl);
        }
    });
};
 
        // Load and display saved clip from localStorage
            const loadSavedClips = () => {
            const currentUrl = window.location.href;

            chrome.storage.local.get(['clipData', 'clipVideoUrl'], (result) => {
            const savedUrl = result.clipVideoUrl;
        if (savedUrl !== currentUrl) {
        // Clear old data if video changed
            chrome.storage.local.remove(['clipData', 'clipVideoUrl']);
            console.log('New video detected. Old clip data cleared.');
            return;
        }

        if (!result.clipData || result.clipData.length === 0) return;

            window.clipData = result.clipData;
            const clip = window.clipData[0];
            const container = document.createElement('div');
            container.style.marginTop = '10px';

            const img = document.createElement('img');
            img.src = clip.image;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '6px';
            img.style.display = 'block';
            img.style.marginBottom = '4px';

        // Timestamp click
            const timestamp = clip.timestamp || 0;
            const timestampLink = document.createElement('div');
            timestampLink.textContent = `⏱️ ${formatTime(timestamp)}`;
            timestampLink.style.cssText = `
                display: inline-block;
                margin-bottom: 8px;
                color: #1976D2;
                font-weight: bold;
                cursor: pointer;
                text-decoration: underline;
            `;
            timestampLink.addEventListener('click', () => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = timestamp;
                video.scrollIntoView({ behavior: 'smooth', block: 'center' });
                video.focus();
            }
        });

            container.appendChild(timestampLink);

            const questionTextarea = document.createElement('textarea');
            questionTextarea.value = clip.question;
            questionTextarea.placeholder = 'Ask a question about this screenshot...';
            questionTextarea.style.width = '100%';
            questionTextarea.style.height = '60px';
            questionTextarea.style.padding = '6px';
            questionTextarea.style.border = '2px solid #FFEB3B';
            questionTextarea.style.borderRadius = '6px';
            questionTextarea.style.boxSizing = 'border-box';
            questionTextarea.style.marginBottom = '8px';

            questionTextarea.addEventListener('input', saveClipData);

            const answerTextarea = document.createElement('textarea');
            answerTextarea.readOnly = true;
            answerTextarea.value = clip.answer || '';
            answerTextarea.placeholder = 'Answer...';
            answerTextarea.style.width = '100%';
            answerTextarea.style.height = '60px';
            answerTextarea.style.padding = '6px';
            answerTextarea.style.border = '2px solid #FFEB3B';
            answerTextarea.style.borderRadius = '6px';
            answerTextarea.style.boxSizing = 'border-box';
            answerTextarea.style.marginBottom = '8px';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.style.cssText = `
                position: absolute;
                top: -2px;
                right: 6px;
                background: transparent;
                color: black;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                font-size: 14px;
                cursor: pointer;
                z-index: 2;
            `;

            deleteBtn.addEventListener('click', () => {
            container.remove();
            saveClipData();
            showNotification('Screenshot deleted');
        });

            container.style.position = 'relative';
            container.appendChild(deleteBtn);
            container.appendChild(img);
            container.appendChild(questionTextarea);
            container.appendChild(answerTextarea);
            clipContentDiv.appendChild(container);
        });
            };
        // Load clips initially
            loadSavedClips();
        
            function showNotification(message, isError = false) {
        // Remove existing notification if any
            const existing = document.getElementById('clipNotification');
            if (existing) existing.remove();

            const notifDiv = document.createElement('div');
            notifDiv.id = 'clipNotification';
            notifDiv.textContent = message;
            notifDiv.style.cssText = `
                background-color: white;
                color: ${isError ? 'red' : 'black'};
                padding: 10px 16px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                border: 2px solid #FFEB3B;
                margin-bottom: 8px;
                transition: opacity 0.5s ease;
                position: relative;
                z-index: 1;
             `;

        // Insert at the top of clipContentDiv
            clipContentDiv.insertBefore(notifDiv, clipContentDiv.firstChild);

            setTimeout(() => {
            notifDiv.style.opacity = '0';
            setTimeout(() => notifDiv.remove(), 500);
        }, 3000);
        }

        // Screenshot capture from video
            screenshotBtn.addEventListener('click', () => {
            const video = document.querySelector('video');
                if (!video) {
                    showNotification('Video not found!', true);
                    return;
                }
        
        // Clear previous clip content
            clipContentDiv.innerHTML = '';
        // Capture video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/png');
        // Create UI for image + input
            const container = document.createElement('div');
            container.style.marginTop = '10px';
            const img = document.createElement('img');
        // Add timestamp element
            const timestamp = Math.floor(video.currentTime);
            const timestampLink = document.createElement('div');
            timestampLink.textContent = `⏱️ ${formatTime(timestamp)}`;
            timestampLink.style.cssText = `
                display: inline-block;
                margin-bottom: 8px;
                color: #1976D2;
                font-weight: bold;
                cursor: pointer;
                text-decoration: underline;
            `;
            timestampLink.addEventListener('click', () => {
            const video = document.querySelector('video');
        if (video) {
        video.currentTime = timestamp;
        video.scrollIntoView({ behavior: 'smooth', block: 'center' });
        video.focus();
    }
});
        container.appendChild(timestampLink);

                img.src = imageUrl;
                img.style.maxWidth = '100%';
                img.style.borderRadius = '6px';
                img.style.display = 'block';
                img.style.marginBottom = '4px';
        
                const questionTextarea = document.createElement('textarea');
                questionTextarea.placeholder = 'Ask a question about this screenshot...';
                questionTextarea.style.width = '100%';
                questionTextarea.style.height = '60px';
                questionTextarea.style.padding = '6px';
                questionTextarea.style.border = '2px solid #FFEB3B';
                questionTextarea.style.borderRadius = '6px';
                questionTextarea.style.boxSizing = 'border-box';
                questionTextarea.style.marginBottom = '8px';
                questionTextarea.addEventListener('input', saveClipData);
        
                const answerTextarea = document.createElement('textarea');
                answerTextarea.readOnly = true;
                answerTextarea.placeholder = 'Answer...';
                answerTextarea.style.width = '100%';
                answerTextarea.style.height = '60px';
                answerTextarea.style.padding = '6px';
                answerTextarea.style.border = '2px solid #FFEB3B';
                answerTextarea.style.borderRadius = '6px';
                answerTextarea.style.boxSizing = 'border-box';
                answerTextarea.style.marginBottom = '8px';
        
            // Create delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '❌';
                deleteBtn.style.cssText = `
                    position: absolute;
                    top: -2px;
                    right: 6px;
                    background: transparent;
                    color: black;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    font-size: 14px;
                    cursor: pointer;
                    z-index: 2;
                `;

            // Add delete functionality
                deleteBtn.addEventListener('click', () => {
                container.remove();
                saveClipData();
                showNotification('Screenshot deleted');
            });

                container.style.position = 'relative'; 
                container.appendChild(deleteBtn);
                container.appendChild(img);
                container.appendChild(questionTextarea);
                container.appendChild(answerTextarea);
                clipContentDiv.appendChild(container);
                saveClipData();
            });
          
        // Convert base64 image to Blob for file upload
                function dataURLtoBlob(dataurl) {
                const arr = dataurl.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
                return new Blob([u8arr], { type: mime });
           }
        //Send clip + question to backend
               sendBtn.addEventListener('click', () => {
               const video = document.querySelector('video');
               const timestamp = video ? Math.floor(video.currentTime) : null;
               const token = localStorage.getItem('qboxai-access-token');

        // Get the first valid question from clipData
                const firstClip = window.clipData.find(clip => clip.question.trim() !== '');
            if (!firstClip) {
                showNotification('Please enter at least one question.', true);
            return;
    }
        // Convert base64 image string to Blob
                const imageBlob = dataURLtoBlob(firstClip.image);

        // Prepare FormData
                const formData = new FormData();
                formData.append('youtube_video_url', window.location.href);
                formData.append('time_stamp', timestamp);
                formData.append('image', imageBlob, 'screenshot.png');
                formData.append('question', firstClip.question);

                fetch('http://127.0.0.1:8000/app1/cliptab/', {
                method: 'POST',
                headers: {
            'Authorization': `Bearer ${token}`  
        },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
        if (data.success && data.data && data.data.answer) {
            const containers = clipContentDiv.querySelectorAll('div');
            const answerTextarea = containers[0].querySelector('textarea[readonly]');
            answerTextarea.value = data.data.answer;
            saveClipData();
        } else {
            showNotification('Unexpected response from backend.', true);
            console.log(data);
        }
    })
    .catch(error => {
        console.error(error);
    });
});

            function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }


        // Clear saved note if video has changed
if (window.location.href !== lastVideoUrl) {
    const oldVideoId = new URLSearchParams(lastVideoUrl.split('?')[1]).get('v');
    if (oldVideoId) {
        localStorage.removeItem(`unsavedNote_${oldVideoId}`);
    }
    lastVideoUrl = window.location.href;
}

        }else if (tabName.toLowerCase() === 'notes') {
    tabContentDiv.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
            <div id="noteNotification" style="display:none;padding:6px;background:#dff0d8;color:#3c763d;border:1px solid #d6e9c6;border-radius:6px;text-align:center;font-size:12px;"></div>

            <div style="display:flex;gap:6px;justify-content:center;">
                <button id="newNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">New Note</button>
                <button id="saveNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Save</button>
            </div>

            <!-- Full Toolbar -->
            <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">
                <button onclick="document.execCommand('bold')" style="font-weight:bold;padding:4px 8px;border:2px solid #FFEB3B;">B</button>
                <button onclick="document.execCommand('italic')" style="font-style:italic;padding:4px 8px;border:2px solid #FFEB3B;">I</button>
                <button onclick="document.execCommand('underline')" style="text-decoration:underline;padding:4px 8px;border:2px solid #FFEB3B;">U</button>
                <button onclick="document.execCommand('insertUnorderedList')" style="padding:4px 8px;border:2px solid #FFEB3B;">• List</button>
                <button onclick="document.execCommand('insertOrderedList')" style="padding:4px 8px;border:2px solid #FFEB3B;">1. List</button>

            <select onchange="document.execCommand('foreColor', false, this.value)" style="padding:4px;border:2px solid #FFEB3B;">
                <option value="">Text Color</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
            </select>

            <select onchange="document.execCommand('fontSize', false, this.value)" style="padding:4px;border:2px solid #FFEB3B;">
                <option value="">Font Size</option>
                <option value="1">Very Small</option>
                <option value="2">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">Larger</option>
                <option value="6">Extra Large</option>
                <option value="7">Huge</option>
            </select>

            <select onchange="document.execCommand('fontName', false, this.value)" style="padding:4px;border:2px solid #FFEB3B;">
                <option value="">Font Family</option>
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>

            <select onchange="document.execCommand('hiliteColor', false, this.value)" style="padding:4px;border:2px solid #FFEB3B;">
                <option value="">Highlight</option>
                <option value="yellow">Yellow</option>
                <option value="lightgreen">Green</option>
                <option value="lightblue">Blue</option>
                <option value="pink">Pink</option>
            </select>
        </div>

            <div id="noteInput" contenteditable="true" 
                style="min-height:60px;width:100%;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;background:white;color:black;">
                Type your note here...
            </div>

            <div id="notesDisplay" style="width:100%;height:200px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow-y:auto;background-color:white;color:black;"></div>
        </div>
    `;

                const noteInput = document.getElementById('noteInput');
                const videoId = new URLSearchParams(window.location.search).get('v');
                const unsavedKey = `unsavedNote_${videoId}`;

                function showNoteMessage(message, isError = false) {
                const existing = document.getElementById('noteNotification');
            if (existing) existing.remove();

                const noteNotification = document.createElement('div');
        noteNotification.id = 'noteNotification';
        noteNotification.textContent = message;
        noteNotification.style.cssText = `
            background-color: white;
            color: ${isError ? 'red' : 'black'};
            padding: 10px 16px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            font-size: 14px;
            border: 2px solid #FFEB3B;
            margin-bottom: 8px;
            transition: opacity 0.5s ease;
            position: relative;
            z-index: 1;
            text-align: center;
        `;
        const container = tabContentDiv.querySelector('div');
        container.insertBefore(noteNotification, container.children[1]);
        setTimeout(() => {
            noteNotification.style.opacity = '0';
            setTimeout(() => noteNotification.remove(), 500);
        }, 3000);
    }

   noteInput.addEventListener('keydown', (e) => {
    // Prevent YouTube shortcuts from triggering while typing
    e.stopPropagation();

    // Prevent 't' key (and others) from triggering YouTube behavior
    const isCharKey = e.key.length === 1;
    if (isCharKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        // Manually insert character (optional fallback)
        document.execCommand('insertText', false, e.key);
        return;
    }

    // Handle formatting shortcuts
    if (e.ctrlKey) {
        if (e.key === 'b') {
            document.execCommand('bold');
            e.preventDefault();
        } else if (e.key === 'i') {
            document.execCommand('italic');
            e.preventDefault();
        } else if (e.key === 'u') {
            document.execCommand('underline');
            e.preventDefault();
        }
    }
});

    const saved = localStorage.getItem(unsavedKey);
if (saved && saved !== 'Type your note here...') {
    noteInput.innerHTML = saved;
} else {
    noteInput.innerHTML = 'Type your note here...';
}

    noteInput.addEventListener('input', (e) => {
        localStorage.setItem(unsavedKey, e.target.innerHTML);
    });

    document.getElementById('newNoteBtn').addEventListener('click', () => {
        noteInput.innerHTML = '';
        noteInput.focus();
        localStorage.removeItem(unsavedKey);
    });

    document.getElementById('saveNoteBtn').addEventListener('click', async () => {
        const token = localStorage.getItem('qboxai-access-token');
        if (!token) {
            showNoteMessage('Please login to save notes.', true);
            return;
        }

        const noteContent = noteInput.innerHTML.trim();
        if (!noteContent) {
            showNoteMessage("Please enter some content for the note!", true);
            return;
        }

        const videoUrl = window.location.href;
        const video = document.querySelector('video');
        const seconds = video ? Math.floor(video.currentTime) : 0;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeStampFormatted = `${minutes}:${remainingSeconds}`;

        const noteData = {
            youtube_video_url: videoUrl,
            notes: noteContent,
            time_stamp: timeStampFormatted
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/app1/create-note/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(noteData)
            });

            if (response.ok) {
                const result = await response.json();
                showNoteMessage('Note saved successfully!');
noteInput.innerHTML = '';
localStorage.removeItem(unsavedKey);
const newNote = result.data;

setTimeout(() => {
    displayNotes([newNote]);
}, 0);

            } else {
                const errorData = await response.json();
                showNoteMessage('Failed to save note! ' + (errorData.message || ''), true);
            }
        } catch (error) {
            console.error('Error:', error);
            showNoteMessage('Something went wrong while saving the note.', true);
        }
    });

    function displayNotes(notes) {
        const notesDisplayDiv = document.getElementById('notesDisplay');
        notesDisplayDiv.innerHTML = '';

        function formatSecondsToTimestamp(seconds) {
            seconds = Number(seconds);
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        if (!notes || notes.length === 0) {
            notesDisplayDiv.innerHTML = '<p style="color:gray;text-align:center;">No notes available.</p>';
            return;
        }

        notes.forEach(note => {
            const timeFormatted = formatSecondsToTimestamp(note.time_stamp);
            const noteDiv = document.createElement('div');
            noteDiv.style.cssText = 'margin-bottom: 16px; padding:8px; border:1px solid #ccc; border-radius:8px;';

            const timestampLink = document.createElement('div');
            timestampLink.textContent = `⏱️ ${timeFormatted}`;
            timestampLink.style.cssText = `
                color: #1976D2;
                font-weight: bold;
                cursor: pointer;
                text-decoration: underline;
                margin-bottom: 6px;
            `;
            timestampLink.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.currentTime = note.time_stamp;
                    video.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    video.focus();
                }
            });

            const noteContent = document.createElement('p');
            noteContent.innerHTML = note.notes;

            noteDiv.appendChild(timestampLink);
            noteDiv.appendChild(noteContent);
            notesDisplayDiv.appendChild(noteDiv);
        });
    }
}
        }
                setInterval(() => {
                if (location.href !== lastUrl) {
                lastUrl = location.href;
                checkAndInject();
            }
        }, 1000);

                checkAndInject();
            })();