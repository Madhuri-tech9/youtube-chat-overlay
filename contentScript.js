(function () {
    let overlay = null;
    let vnButton = null;
    let lastUrl = location.href;
      
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
        vnButton.addEventListener('click', toggleOverlay);
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
        header.innerHTML = '<span>MY APP</span>';
        overlay.appendChild(header);

        const tabContent = document.createElement('div');
        tabContent.id = 'tabContent';
        tabContent.style.marginTop = '10px';
        overlay.appendChild(tabContent);

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

        const tabs = ['Q/A', 'clip', 'notes'];
        tabs.forEach(tab => {
            const button = document.createElement('button');
            button.innerText = tab;
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
            button.addEventListener('click', () => switchTab(tab));
            tabButtons.appendChild(button);
        });

        overlay.appendChild(tabButtons);
        switchTab('Q/A');
    }

    function toggleOverlay() {
        if (!overlay) return;
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    }

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

    function checkAndInject() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('youtube.com/watch')) {
            removeOverlayAndButton();
            localStorage.removeItem('notes');
            createVNButton();
            createOverlay();
        } else {
            removeOverlayAndButton();
        }
    }
    let lastVideoUrl = window.location.href; 

    function switchTab(tabName) {
        const tabContentDiv = document.getElementById('tabContent');
    
        // Change the tab styles based on the active tab
        document.querySelectorAll('#my-overlay button').forEach(btn => {
            if (['Q/A', 'clip', 'notes'].includes(btn.innerText)) {
                btn.style.background = btn.innerText.toLowerCase() === tabName.toLowerCase() ? '#FFEB3B' : 'black';
                btn.style.color = btn.innerText.toLowerCase() === tabName.toLowerCase() ? 'black' : 'white';
            }
        });
    
        // Check for new video URL and clear saved data if the video URL changes
            if (window.location.href !== lastVideoUrl) {
            localStorage.removeItem('savedQuestion');
            localStorage.removeItem('savedAnswer')
            lastVideoUrl = window.location.href; 
        }
    
        if (tabName.toLowerCase() === 'q/a') {
            const savedQuestion = localStorage.getItem('savedQuestion') || '';
            const savedAnswer = localStorage.getItem('savedAnswer') || '';
    
            tabContentDiv.innerHTML = `
                <textarea id="questionInput" placeholder="Ask your question here..." style="width:100%;height:60px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
                <div style="display:flex;justify-content:flex-end;margin-top:8px;">
                    <button id="sendQuestionBtn" style="background:#FFEB3B;color:black;padding:6px 14px;font-weight:bold;border:2px solid black;border-radius:8px;font-size:12px;cursor:pointer;">Send</button>
                </div>
                <h4 style="margin-top:10px;">Answer:</h4>
                <textarea id="answerOutput" placeholder="Answer" readonly style="width:100%;height:80px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
            `;
    
            const questionInput = document.getElementById('questionInput');
            const answerBox = document.getElementById('answerOutput');
    
        // Restore saved question and answer
            questionInput.value = savedQuestion;
            answerBox.value = savedAnswer;
    
        // Save question to localStorage when typing
            questionInput.addEventListener('input', () => {
            localStorage.setItem('savedQuestion', questionInput.value);
        });
    
        // Send question and fetch answer
            document.getElementById('sendQuestionBtn').addEventListener('click', async () => {
                const question = questionInput.value.trim();
                if (!question) {
                    alert('Please enter a question!');
                    return;
                }
    
                const video = document.querySelector('video');
                const title = document.title;
                const videoUrl = window.location.href;
                const timestamp = video ? Math.floor(video.currentTime) : null;
    
                const payload = {
                    title,
                    video_url: videoUrl,
                    timestamp,
                    question
                };
    
                try {
                    answerBox.value = 'Loading...';
                    const response = await fetch('http://localhost:5000/ask', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
    
                    const data = await response.json();
                    answerBox.value = data.answer || 'No answer received.';
                    localStorage.setItem('savedAnswer', answerBox.value); 
                } catch (error) {
                    console.error(error);
                    answerBox.value = 'Error getting answer.';
                }
            });
    
            // Listen for video load event to clear saved data
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.addEventListener('loadeddata', () => {
                    localStorage.removeItem('savedQuestion');
                    localStorage.removeItem('savedAnswer');
                    questionInput.value = '';
                    answerBox.value = ''; 
                });
            }
    

            // Detect video ID from URL
                const currentVideoId = new URLSearchParams(window.location.search).get("v");
                if (!window.lastVideoId || window.lastVideoId !== currentVideoId) {
                window.lastVideoId = currentVideoId;
                window.clipData = []; 
            }

        }   else if (tabName.toLowerCase() === 'clip') {
            tabContentDiv.innerHTML = `
                <div id="clipContent" style="width:100%;min-height:120px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow:auto;background:white;"></div>
                <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;flex-wrap:wrap;">
                    <button id="sendBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Send</button>
                    <button style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Save Clip</button>
                    <button id="screenshotBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Screenshot</button>
                </div>
                <div id="backendReply" style="margin-top:10px;padding:8px;background:#e0f7fa;border-radius:6px;display:none;"></div>
            `;
        
            const clipContentDiv = document.getElementById('clipContent');
            const screenshotBtn = document.getElementById('screenshotBtn');
            const sendBtn = document.getElementById('sendBtn');
        
            // Global clipData array
                if (!window.clipData) window.clipData = [];
        
            // Save clips to variable
                const saveClipData = () => {
                window.clipData = [...document.querySelectorAll('#clipContent > div')].map(container => {
                const img = container.querySelector('img');
                const question = container.querySelector('textarea:not([readonly])').value;
                const answer = container.querySelector('textarea[readonly]').value;
                return { image: img.src, question, answer };
                });
            };
        
            // Load saved clips
                const loadSavedClips = () => {
                window.clipData.forEach(clip => {
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
                });
            };
        
            // Initial load
            loadSavedClips();
        
            // Screenshot functionality
                screenshotBtn.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (!video) {
                    alert('Video not found!');
                    return;
                }
        
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL('image/png');
        
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
        
            // Send to backend
                sendBtn.addEventListener('click', () => {
                const video = document.querySelector('video');
                const timestamp = video ? Math.floor(video.currentTime) : null;  
                
                    const payload = window.clipData.map(clip => ({
                    title: document.title,  
                    video_url: window.location.href,  
                    timestamp: timestamp,  
                    image: clip.image,
                    question: clip.question
                }));
            
                fetch('http://localhost:5000/sendClips', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    const reply = document.getElementById('backendReply');
                    reply.textContent = data.message;
                    reply.style.display = 'block';
                })
                .catch(error => {
                    console.error(error);
                });
            });
            
    
        }else if (tabName.toLowerCase() === 'notes') {
            tabContentDiv.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
                    <div style="display:flex;gap:6px;justify-content:center;">
                        <button id="newNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">New Note</button>
                        <button id="saveNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Save</button>
                        <button id="deleteNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Delete</button>
                        <button id="exportNotesBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Export Notes</button>
                    </div>
                    <textarea id="noteInput" placeholder="Type your note here..." style="width:100%;height:60px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
                    <div id="notesDisplay" style="width:100%;height:200px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow-y:auto;background-color:white;color:black;"></div>
                </div>
            `;
        
            const videoId = new URLSearchParams(window.location.search).get('v');
            const unsavedKey = `unsavedNote_${videoId}`;
            const noteInput = document.getElementById('noteInput');
        
            noteInput.value = localStorage.getItem(unsavedKey) || '';
        
            noteInput.addEventListener('input', (e) => {
            localStorage.setItem(unsavedKey, e.target.value);
            });
        
            document.getElementById('newNoteBtn').addEventListener('click', () => {
                noteInput.value = '';
                noteInput.focus();
                localStorage.removeItem(unsavedKey);
            });
        
            document.getElementById('saveNoteBtn').addEventListener('click', async () => {
                const noteContent = noteInput.value.trim();
                if (!noteContent) {
                    alert("Please enter some content for the note!");
                    return;
                }
        
                const video = document.querySelector('video');
                const title = document.title;
                const videoUrl = window.location.href;
                const timestamp = video ? Math.floor(video.currentTime) : null;
        
                const noteData = { title, video_url: videoUrl, time_stamp: timestamp, notes: noteContent };
        
                try {
                    const response = await fetch('http://localhost:5000/notes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(noteData)
                    });
        
                    if (response.ok) {
                        alert('Note saved successfully!');
                        noteInput.value = '';
                        localStorage.removeItem(unsavedKey);
                        loadSavedNotes();
                    } else {
                        alert('Failed to save note!');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Something went wrong while saving the note.');
                }
            });
        
            document.getElementById('deleteNoteBtn').addEventListener('click', () => {
                noteInput.value = '';
                localStorage.removeItem(unsavedKey);
                alert("Note deleted (unsaved draft cleared).");
            });
        
            document.getElementById('exportNotesBtn').addEventListener('click', async () => {
                try {
                    const response = await fetch('http://localhost:5000/notes');
                    const notes = await response.json();
        
                    const filtered = notes.filter(note => {
                        const noteVideoId = new URLSearchParams(new URL(note.video_url).search).get('v');
                        return noteVideoId === videoId;
                    });
        
                    if (filtered.length === 0) {
                        alert("No notes to export.");
                        return;
                    }
        
                    const csvContent = filtered.map(note => {
                        return `"${note.title.replace(/"/g, '""')}","${note.video_url}","${note.time_stamp}","${note.notes.replace(/"/g, '""')}"`;
                    });
        
                    const csvHeader = `"Title","Video URL","Timestamp","Note"`;
                    const blob = new Blob([csvHeader + "\n" + csvContent.join("\n")], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
        
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'exported_notes.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.error("Error exporting notes:", error);
                    alert("Could not export notes.");
                }
            });
        
            function loadSavedNotes() {
                fetch('http://localhost:5000/notes')
                    .then(res => res.ok ? res.json() : [])
                    .then(notes => {
                        const filtered = notes.filter(note => {
                            const noteVideoId = new URLSearchParams(new URL(note.video_url).search).get('v');
                            return noteVideoId === videoId;
                        });
                        displayNotes(filtered);
                    })
                    .catch(error => {
                        console.warn('Could not load notes:', error);
                        displayNotes([]);
                    });
            }
        
            function displayNotes(notes) {
                const notesDisplayDiv = document.getElementById('notesDisplay');
                notesDisplayDiv.innerHTML = '';
                if (notes.length === 0) {
                    notesDisplayDiv.innerHTML = '<p>No notes available.</p>';
                    return;
                }
        
                notes.forEach(note => {
                    const noteDiv = document.createElement('div');
                    noteDiv.innerHTML = `
                        <div style="margin-bottom: 16px;">
                            <h3 style="margin: 0; font-size: 16px;">${note.title}</h3>
                            <p><strong>Video URL:</strong> ${note.video_url}</p>
                            <p><strong>Timestamp:</strong> ${note.time_stamp}</p>
                            <p><strong>Note:</strong> ${note.notes}</p>
                        </div>
                        <hr>
                    `;
                    notesDisplayDiv.appendChild(noteDiv);
                });
            }
        
            try {
                loadSavedNotes();
            } catch (err) {
                console.warn('Skipping loadSavedNotes:', err);
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