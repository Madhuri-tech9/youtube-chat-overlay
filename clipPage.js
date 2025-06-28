export function renderClipPage(tabContentDiv) {
    const currentVideoId = new URLSearchParams(window.location.search).get("v");
    if (!window.lastVideoId || window.lastVideoId !== currentVideoId) {
        window.lastVideoId = currentVideoId;
        window.clipData = [];
    }

    if (!tabContentDiv) return;
    tabContentDiv.innerHTML = `
        <div id="clipContent" style="width:100%;min-height:120px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow:auto;background:white;"></div>
        <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;flex-wrap:wrap;">
            <button id="sendBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Send</button>
            <button id="screenshotBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Screenshot</button>
        </div>
        <div id="backendReply" style="margin-top:10px;padding:8px;background:#e0f7fa;border-radius:6px;display:none;"></div>
    `;

    const clipContentDiv = document.getElementById('clipContent');
    const screenshotBtn = document.getElementById('screenshotBtn');
    const sendBtn = document.getElementById('sendBtn');

    if (!window.clipData) window.clipData = [];

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const saveClipData = () => {
        const currentUrl = window.location.href;
        window.clipData = [...clipContentDiv.querySelectorAll('div[data-timestamp]')].map(container => {
            const img = container.querySelector('img');
            const questionEl = container.querySelector('textarea:not([readonly])');
            const answerEl = container.querySelector('textarea[readonly]');
            const timestamp = container.getAttribute('data-timestamp') || 0;

            return {
                image: img?.src || '',
                question: questionEl?.value || '',
                answer: answerEl?.value || '',
                timestamp: parseInt(timestamp)
            };
        });

        chrome.storage.local.set({
            clipData: window.clipData,
            clipVideoUrl: currentUrl
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error saving clip data:', chrome.runtime.lastError);
            }
        });
    };

    const showNotification = (message, isError = false) => {
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
        `;

        clipContentDiv.insertBefore(notifDiv, clipContentDiv.firstChild);
        setTimeout(() => {
            notifDiv.style.opacity = '0';
            setTimeout(() => notifDiv.remove(), 500);
        }, 3000);
    };

    const loadSavedClips = () => {
        const currentUrl = window.location.href;

        chrome.storage.local.get(['clipData', 'clipVideoUrl'], (result) => {
            if (result.clipVideoUrl !== currentUrl) {
                chrome.storage.local.remove(['clipData', 'clipVideoUrl']);
                return;
            }

            if (!result.clipData || result.clipData.length === 0) return;

            result.clipData.forEach(clip => {
                const container = createClipContainer(clip.image, clip.question, clip.answer, clip.timestamp);
                clipContentDiv.appendChild(container);
            });
        });
    };

    const createClipContainer = (imageUrl, question = '', answer = '', timestamp = 0) => {
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.marginTop = '10px';
        container.setAttribute('data-timestamp', timestamp);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.style.cssText = `
            position: absolute; top: -2px; right: 6px;
            background: transparent; color: black;
            border: none; border-radius: 50%;
            width: 24px; height: 24px;
            font-size: 14px; cursor: pointer; z-index: 2;
        `;
        deleteBtn.addEventListener('click', () => {
            container.remove();
            saveClipData();
            showNotification('Deleted from UI only – not removed from server');
        });

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

        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            max-width: 100%;
            max-height: 150px;
            object-fit: cover;
            border-radius: 6px;
            display: block;
            margin-bottom: 4px;
        `;

        const questionTextarea = document.createElement('textarea');
        questionTextarea.value = question;
        questionTextarea.placeholder = 'Ask a question about this screenshot...';
        Object.assign(questionTextarea.style, {
            width: '100%', height: '60px', padding: '6px',
            border: '2px solid #FFEB3B', borderRadius: '6px',
            boxSizing: 'border-box', marginBottom: '8px'
        });
        questionTextarea.addEventListener('input', saveClipData);

        const answerTextarea = document.createElement('textarea');
        answerTextarea.readOnly = true;
        answerTextarea.value = answer;
        answerTextarea.placeholder = 'Answer...';
        Object.assign(answerTextarea.style, {
            width: '100%', height: '60px', padding: '6px',
            border: '2px solid #FFEB3B', borderRadius: '6px',
            boxSizing: 'border-box', marginBottom: '8px'
        });

        container.append(deleteBtn, timestampLink, img, questionTextarea, answerTextarea);
        return container;
    };

    screenshotBtn.addEventListener('click', () => {
        const video = document.querySelector('video');
        if (!video) return showNotification('Video not found!', true);

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/png');
        const timestamp = Math.floor(video.currentTime);

        const container = createClipContainer(imageUrl, '', '', timestamp);
        clipContentDiv.innerHTML = ''; // Show one clip at a time
        clipContentDiv.appendChild(container);
        saveClipData();
    });

    const dataURLtoBlob = (dataurl) => {
        const [meta, base64] = dataurl.split(',');
        const mime = meta.match(/:(.*?);/)[1];
        const binary = atob(base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: mime });
    };

    sendBtn.addEventListener('click', () => {
        const video = document.querySelector('video');
        const timestamp = video ? Math.floor(video.currentTime) : null;
        const token = localStorage.getItem('qboxai-access-token');

        const firstClip = window.clipData.find(clip => clip.image && clip.image.trim() !== '');
        if (!firstClip) return showNotification('Please take a screenshot before sending.', true);
        if (!firstClip.question || firstClip.question.trim() === '') return showNotification('Please enter the question.', true);

        const formData = new FormData();
        formData.append('youtube_video_url', window.location.href);
        formData.append('time_stamp', timestamp);
        formData.append('image', dataURLtoBlob(firstClip.image), 'screenshot.png');
        formData.append('question', firstClip.question);

        showNotification('Question sent...');
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.5';
        sendBtn.style.cursor = 'not-allowed';
        sendBtn.textContent = 'Sending...';

        setTimeout(() => {
            fetch('http://127.0.0.1:8000/app1/cliptab/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data?.answer) {
                    const container = clipContentDiv.querySelector('div[data-timestamp]');
                    const answerTextarea = container?.querySelector('textarea[readonly]');
                    if (answerTextarea) answerTextarea.value = data.data.answer;
                    saveClipData();
                    showNotification('Answer received ✔');
                } else {
                    showNotification('Unexpected response from backend.', true);
                }
            })
            .catch(err => {
                console.error(err);
                showNotification('Failed to fetch answer.', true);
            })
            .finally(() => {
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
                sendBtn.style.cursor = 'pointer';
                sendBtn.textContent = 'Send';
            });
        }, 5000);
    });

    loadSavedClips();
}
