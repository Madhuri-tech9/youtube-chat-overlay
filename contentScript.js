(function () {
    let overlay = null;
    let qboxaiButton = null;
    let lastUrl = location.href;

    //Global for last video URL used by qapage.js
    window.lastVideoUrlRef = { value: location.href };

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.innerText = message;
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
        setTimeout(() => {
            notification.style.opacity = '0';
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
            right: 0px;
            z-index: 9999;
            background: #FFEB3B;
            color: black;
            font-weight: bold;
            border: 2px solid black;
            border-radius: 12px 0 0 12px;
            padding: 6px 4px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 0 6px rgba(0,0,0,0.4);
        `;
        document.body.appendChild(qboxaiButton);

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
    <form id="login-form">
    <input id="email" type="text" placeholder="Email" autocomplete="email" 
        style="width: 100%; height: 28px; margin-bottom: 6px; font-size: 13px; padding: 4px 8px; box-sizing: border-box;" />

    <div id="email-error" style="color: red; font-size: 10px; height: 14px; margin-bottom: 6px;"></div>

    <div style="position: relative; width: 100%; margin-bottom: 8px;">
        <input id="password" type="password" placeholder="Password" autocomplete="current-password"
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
    </form>
`; // Append the login box to the document body
        document.body.appendChild(loginBox);
     // Add password toggle event listener AFTER loginBox is added to DOM
    const toggleIcon = document.getElementById('toggle-password');
    toggleIcon.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleIcon.textContent = isPassword ? '🙈' : '👁️'; 
});

    // Add click event listener to the Submit button
        document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('email-error');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

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

        if (tabName.toLowerCase() === 'q/a') {
    import(chrome.runtime.getURL('qapage.js')).then(module => {
       module.renderQAPage(tabContentDiv, tabName, window.lastVideoUrlRef);
    });

        } else if (tabName.toLowerCase() === 'clip') {
            import(chrome.runtime.getURL('clipPage.js')).then(module => {
                module.renderClipPage(tabContentDiv);
            });
        } else if (tabName.toLowerCase() === 'notes') {
            import(chrome.runtime.getURL('notesPage.js')).then(module => {
                module.renderNotesPage(tabContentDiv);
            });
        }
    }

    // Detect URL changes for YouTube navigation
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndInject();
        }
    }, 1000);

    checkAndInject();
})();
