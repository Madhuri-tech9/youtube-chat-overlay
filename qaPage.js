export function renderQAPage(tabContentDiv, tabName, lastVideoUrlRef) {
    const currentVideoId = new URLSearchParams(window.location.search).get("v");
    const lastVideoId = new URLSearchParams(lastVideoUrlRef.value?.split('?')[1] || '').get("v");

    const isNewVideo = currentVideoId && currentVideoId !== lastVideoId;

    if (isNewVideo) {
        localStorage.removeItem('savedQuestion');
        localStorage.removeItem('savedAnswer');
        localStorage.removeItem('savedTimestamp');
        lastVideoUrlRef.value = window.location.href;
    }

    if (tabName.toLowerCase() !== 'q/a') return;

    const savedQuestion = localStorage.getItem('savedQuestion') || '';
    const savedAnswer = localStorage.getItem('savedAnswer') || '';
    const savedTimestamp = localStorage.getItem('savedTimestamp') || '';

    tabContentDiv.innerHTML = `
        <div id="qaNotification" style="display:none;padding:8px;margin-top:8px;border-radius:6px;font-size:14px;text-align:center;"></div>

        <textarea id="questionInput" placeholder="Ask your question here..." style="width:100%;height:60px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>

        <div style="display:flex;justify-content:flex-end;margin-top:8px;">
            <button id="sendQuestionBtn" style="background:#FFEB3B;color:black;padding:6px 14px;font-weight:bold;border:2px solid black;border-radius:8px;font-size:12px;cursor:pointer;">Send</button>
        </div>

        <div id="timestampContainer" style="margin-top:10px;"></div>

        <div style="flex-grow:1;display:flex;flex-direction:column;">
            <h4 style="margin-top:8px;margin-bottom:4px;">Answer:</h4>
            <textarea id="answerOutput" placeholder="Answer" readonly
                style="flex-grow:1;width:100%;min-height:120px;padding:8px;border-radius:8px;
                border:2px solid #FFEB3B;box-sizing:border-box;resize: vertical;overflow:auto;">
            </textarea>
        </div>
    `;

    tabContentDiv.style.display = 'flex';
    tabContentDiv.style.flexDirection = 'column';
    tabContentDiv.style.height = '100%';

    const questionInput = document.getElementById('questionInput');
    const answerBox = document.getElementById('answerOutput');
    const timestampContainer = document.getElementById('timestampContainer');

    questionInput.value = savedQuestion;
    answerBox.value = savedAnswer;

    //Show timestamp even when switching tabs
    if (savedTimestamp && timestampContainer) {
        const timestampLink = document.createElement('div');
        timestampLink.textContent = `⏱️ ${savedTimestamp}`;
        timestampLink.style.cssText = `
            color: #1976D2;
            font-weight: bold;
            cursor: pointer;
            text-decoration: underline;
            margin-bottom: 6px;
        `;

        timestampLink.addEventListener('click', () => {
            const [min, sec] = savedTimestamp.split(':').map(Number);
            const video = document.querySelector('video');
            if (video && !isNaN(min) && !isNaN(sec)) {
                video.currentTime = min * 60 + sec;
                video.scrollIntoView({ behavior: 'smooth', block: 'center' });
                video.focus();
            }
        });

        timestampContainer.appendChild(timestampLink);
    }

    questionInput.addEventListener('input', () => {
        localStorage.setItem('savedQuestion', questionInput.value);
    });

    document.getElementById('sendQuestionBtn').addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) {
            window.showQANotification("Please enter a question!", true);
            return;
        }

        const video = document.querySelector('video');
        const videoId = new URLSearchParams(window.location.search).get("v");
        const videoUrl = `https://youtu.be/${videoId}`;
        const timestampInSeconds = video ? Math.floor(video.currentTime) : null;

        const minutes = Math.floor(timestampInSeconds / 60);
        const seconds = timestampInSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        localStorage.setItem('savedTimestamp', formattedTime);

        timestampContainer.innerHTML = ''; // Clear previous timestamp
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

        const payload = {
            youtube_video_url: videoUrl,
            question: question,
            time_stamp: formattedTime
        };

        const token = localStorage.getItem('qboxai-access-token');

        try {
            answerBox.value = 'Loading...';

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

            if (data.success && data.data && data.data.answer) {
                answerBox.value = data.data.answer;
                localStorage.setItem('savedAnswer', answerBox.value);
                localStorage.setItem('savedQuestion', question);
            } else {
                const backendMessage = data.message || 'Something went wrong.';
                answerBox.value = backendMessage;
                localStorage.setItem('savedAnswer', backendMessage);

                const lowerMsg = backendMessage.toLowerCase();
                const isTranscriptUnavailable = lowerMsg.includes('transcript') && lowerMsg.includes('not available');

                if (!isTranscriptUnavailable) {
                    showQANotification(backendMessage, true);
                }
            }
        } catch (error) {
            console.error(error);
            answerBox.value = 'Error getting answer.';
        }
    });
}
