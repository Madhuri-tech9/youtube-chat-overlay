(function () {
    let overlay = null;
    let vnButton = null;
    let lastUrl = location.href;
    // Function to create the VN button and add it to the page
    function createVNButton() {
        vnButton = document.createElement('button');
        vnButton.id = 'vn-button';
        vnButton.innerText = 'VN';
        vnButton.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            background: #FFEB3B;
            color: black;
            font-weight: bold;
            border: 2px solid black;
            border-radius: 20px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 0 6px rgba(0,0,0,0.4);
        `;
        document.body.appendChild(vnButton);
    // Add click event listener to handle showing/hiding overlay and login box
        vnButton.addEventListener('click', () => {

    // If overlay is visible, hide overlay and login box (toggle off)
    if (overlay && overlay.style.display === 'block') {
        overlay.style.display = 'none';
        document.getElementById('login-box').style.display = 'none';
        return;
    }

    // Check if user credentials are stored in localStorage (user logged in)
        const storedUsername = localStorage.getItem('vn-username');
        const storedPassword = localStorage.getItem('vn-password');

        if (storedUsername && storedPassword) {
    // User is already logged in: hide login box and show overlay
        document.getElementById('login-box').style.display = 'none';
        overlay.style.display = 'block';

    // If a video is present, resume playing it
        const video = document.querySelector('video');
        if (video) {
            video.play();
        }
        return; 
    }

    // User is not logged in: clear stored credentials and show login box
        localStorage.removeItem('vn-username');
        localStorage.removeItem('vn-password');
        const loginBox = document.getElementById('login-box');
        if (loginBox) {
    // Clear previous input values in login form
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
    // Display the login box to prompt user for credentials
        loginBox.style.display = 'block';
    }
    // Pause the video when login box is shown
    const video = document.querySelector('video');
    if (video) {
        video.pause();
    }
    // Call function to toggle overlay visibility
    toggleOverlay();
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
        localStorage.removeItem('vn-username');
        overlay.style.display = 'none';
        document.getElementById('login-box').style.display = 'none';
        alert('Logged out! Click VN button to login again.');
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
    // Insert HTML content: heading, username & password inputs, error message div, and submit button
        loginBox.innerHTML = `
            <h4 style="margin: 0 0 8px;">Login</h4>
            <input id="username" type="text" placeholder="Username"
                style="width: 90%; height: 22px; margin-bottom: 2px; font-size: 12px;" />
            <div id="username-error" style="color: red; font-size: 10px; height: 14px; margin-bottom: 6px;"></div>
            <input id="password" type="password" placeholder="Password"
                style="width: 90%; height: 22px; margin-bottom: 8px; font-size: 12px;" />
            <button id="login-submit"
                style="width: 60%; padding: 6px; background: #FFEB3B; border: none; font-weight: bold; cursor: pointer;">
                Submit
            </button>
        `;
    // Append the login box to the document body
        document.body.appendChild(loginBox);
    // Add click event listener to the Submit button
        document.getElementById('login-submit').addEventListener('click', () => {
        const emailInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const usernameError = document.getElementById('username-error');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
    // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate email format
        if (!emailRegex.test(email)) {
            usernameError.textContent = 'Please enter a valid email address.';
            emailInput.focus();
            return;
        } else {
            usernameError.textContent = '';
        }
    // Check if password is empty
        if (password === '') {
        alert('Password cannot be empty');
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
            localStorage.setItem('vn-access-token', data.access);
            localStorage.setItem('vn-refresh-token', data.refresh);
            localStorage.setItem('vn-username', data.user.email || username);
    // Hide login box and show the overlay
            document.getElementById('login-box').style.display = 'none';
            overlay.style.display = 'block';
    // Resume playing video if any
            const video = document.querySelector('video');
            if (video) video.play();
        } else {
    // Show error message from server or generic message
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    })
            .catch(error => {
            console.error('Login error:', error);
            alert('Login request failed. Try again later.');
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
        if (vnButton) {
            vnButton.remove();
            vnButton = null;
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
            createVNButton();
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
                <h4 style="margin-top:10px;">Answer:</h4>
                <textarea id="answerOutput" placeholder="Answer" readonly style="width:100%;height:80px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
            `;

            function showQANotification(message, isError = false) {
    // Remove any existing notification
    const existing = document.getElementById('qaNotification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'qaNotification';
    notification.textContent = message;

    notification.style.cssText = `
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

    // Insert above the question input
    const questionInput = document.getElementById('questionInput');
    questionInput.parentNode.insertBefore(notification, questionInput);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

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
            const videoUrl = window.location.href;
            const timestampInSeconds = video ? Math.floor(video.currentTime) : null;
        // Format timestamp as mm:ss
            const minutes = Math.floor(timestampInSeconds / 60);
            const seconds = timestampInSeconds % 60;
            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        // Prepare payload for API request
            const payload = {
            youtube_video_url: videoUrl,
            question: question,
            time_stamp: formattedTime
        };
        // Get JWT token from localStorage
            const token = localStorage.getItem('vn-access-token');
        try {
             answerBox.value = 'Loading...';
        // Send POST request to backend
            const response = await fetch('http://127.0.0.1:8000/app1/ask-question/', {
            method: 'POST',
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Add token here
        },
            body: JSON.stringify(payload),
            mode: 'cors'
    });
            const data = await response.json();
        // Display the answer or fallback message
            if (data.success) {
            answerBox.value = data.answer || 'No answer received.';
            localStorage.setItem('savedAnswer', answerBox.value);
        } else {
            answerBox.value = data.message || 'Something went wrong.';
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
                window.clipData = [...document.querySelectorAll('#clipContent > div')].map(container => {
                const img = container.querySelector('img');
                const question = container.querySelector('textarea:not([readonly])').value;
                const answer = container.querySelector('textarea[readonly]').value;
                return { image: img.src, question, answer };
                });
            // 🔁 Save to localStorage
                localStorage.setItem('clipData', JSON.stringify(window.clipData));
            };
        
            // Load and display saved clip from localStorage
                const loadSavedClips = () => {
                if (window.clipData.length === 0) return;
                const clip = window.clipData[0];
                const container = document.createElement('div');
                container.style.marginTop = '10px';
        
                const img = document.createElement('img');
                img.src = clip.image;
                img.style.maxWidth = '100%';
                img.style.borderRadius = '6px';
                img.style.display = 'block';
                img.style.marginBottom = '4px';
        
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
        
                container.appendChild(img);
                container.appendChild(questionTextarea);
                container.appendChild(answerTextarea);
                clipContentDiv.appendChild(container);           
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
               const token = localStorage.getItem('vn-access-token');

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
            'Authorization': `Bearer ${token}`  // Add token here
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
     
        }else if (tabName.toLowerCase() === 'notes') {
        // Inject Notes UI
            tabContentDiv.innerHTML = `
            
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
                <div id="noteNotification" style="display:none;padding:6px;background:#dff0d8;color:#3c763d;border:1px solid #d6e9c6;border-radius:6px;text-align:center;font-size:12px;"></div>
                <div style="display:flex;gap:6px;justify-content:center;">
            <button id="newNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">New Note</button>
            <button id="saveNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Save</button>
        </div>
            <textarea id="noteInput" placeholder="Type your note here..." style="width:100%;height:60px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
            <div id="notesDisplay" style="width:100%;height:200px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow-y:auto;background-color:white;color:black;"></div>
        </div>
    `;

    function showNoteMessage(message, isError = false) {
    // Remove existing notification if present
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

    // Insert it above the noteInput
    const container = tabContentDiv.querySelector('div');
    container.insertBefore(noteNotification, container.children[1]);

    setTimeout(() => {
        noteNotification.style.opacity = '0';
        setTimeout(() => noteNotification.remove(), 500);
    }, 3000);
}

        // Load and display saved notes from the backend
            loadSavedNotes();
            const videoId = new URLSearchParams(window.location.search).get('v');
            const unsavedKey = `unsavedNote_${videoId}`;
            const noteInput = document.getElementById('noteInput');
        // Load unsaved note from localStorage
            noteInput.value = localStorage.getItem(unsavedKey) || '';
        // Save draft to localStorage while typing
            noteInput.addEventListener('input', (e) => {
           localStorage.setItem(unsavedKey, e.target.value);
        });

        // Clear the note input when "New Note" is clicked
            document.getElementById('newNoteBtn').addEventListener('click', () => {
            noteInput.value = '';
            noteInput.focus();
            localStorage.removeItem(unsavedKey);
        });

        // Save the note to the backend when "Save" is clicked
            document.getElementById('saveNoteBtn').addEventListener('click', async () => {
            const token = localStorage.getItem('vn-access-token');
                if (!token) {
                    showNoteMessage('Please login to save notes.', true);
                return;
            }

            const noteContent = noteInput.value.trim();
                if (!noteContent) {
                    showNoteMessage("Please enter some content for the note!", true);
                 return;
             }

            const videoUrl = window.location.href;
            const video = document.querySelector('video');
            const timestampSeconds = video ? Math.floor(video.currentTime) : 0;

        //Prepare the payload for POST request
            const noteData = {
            youtube_video_url: videoUrl,
            notes: noteContent,
            time_stamp: timestampSeconds  
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
                showNoteMessage('Note saved successfully!');
                noteInput.value = '';
                localStorage.removeItem(unsavedKey);
                loadSavedNotes();
            } else {
                const errorData = await response.json();
                showNoteMessage('Failed to save note! ' + (errorData.message || ''), true);
            }
        } catch (error) {
                console.error('Error:', error);
                showNoteMessage('Something went wrong while saving the note.', true);
            }
        });

        // Function to render notes in the notesDisplay area
            function displayNotes(notes) {
            const notesDisplayDiv = document.getElementById('notesDisplay');
            notesDisplayDiv.innerHTML = '';

        // Helper to format seconds to mm:ss
            function formatSecondsToTimestamp(seconds) {
            seconds = Number(seconds);
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }
        // Show a message if there are no notes
            if (!notes || notes.length === 0) {
            notesDisplayDiv.innerHTML = '<p style="color:gray;text-align:center;">No notes available.</p>';
        return;
       }
        // Add each note to the display area
            notes.forEach(note => {
            const timeFormatted = formatSecondsToTimestamp(note.time_stamp);
            const noteDiv = document.createElement('div');
            noteDiv.innerHTML = `
            <div style="margin-bottom: 16px;padding:8px;border:1px solid #ccc;border-radius:8px;">
            <p><strong>Timestamp:</strong> ${timeFormatted}</p>
            <p>${note.notes}</p>
            </div>
        `;
            notesDisplayDiv.appendChild(noteDiv);
        });
    }
        // Fetch saved notes from the backend and call displayNotes()
            async function loadSavedNotes() {
            const token = localStorage.getItem('vn-access-token');
                if (!token) {
                    showNoteMessage('Please login to view saved notes.', true);
                return;
            }
                const videoUrl = window.location.href;
                const encodedVideoUrl = encodeURIComponent(videoUrl);
                try {
                    const response = await fetch(`http://127.0.0.1:8000/app1/create-note/?youtube_video_url=${encodedVideoUrl}`, {
                    headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
                    const data = await response.json(); 
                    let notes = [];
                    if (Array.isArray(data.notes)) {
                    notes = data.notes;
                    } else if (data.notes) {
                    notes = [data.notes];
                }

                        displayNotes(notes);
                    }   catch (error) {
                        console.error("Error loading saved notes:", error);
                        showNoteMessage("Could not load saved notes.", true);
                    }
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