export function renderNotesPage(tabContentDiv) {
    tabContentDiv.innerHTML = `
<div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
    <div id="noteNotification" style="display:none;padding:6px;background:#dff0d8;color:#3c763d;border:1px solid #d6e9c6;border-radius:6px;text-align:center;font-size:12px;"></div>

    <div style="display:flex;gap:6px;justify-content:center;">
        <button id="newNoteBtn" style="background:#FFEB3B;color:black;padding:4px 8px;font-weight:bold;border:2px solid black;border-radius:6px;font-size:10px;cursor:pointer;">New Note</button>
        <button id="saveNoteBtn" style="background:#FFEB3B;color:black;padding:4px 8px;font-weight:bold;border:2px solid black;border-radius:6px;font-size:10px;cursor:pointer;">Save</button>
    </div>

    <div style="display: flex; gap: 10px; justify-content: center; background: #111; padding: 6px 8px; border-radius: 20px; margin-top: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        <button onclick="document.execCommand('bold')" title="Bold" style="background:none;border:none;color:#ccc;font-size:13px;cursor:pointer;"><b>B</b></button>
        <button onclick="document.execCommand('italic')" title="Italic" style="background:none;border:none;color:#ccc;font-size:13px;cursor:pointer;"><i>I</i></button>
        <button onclick="document.execCommand('strikeThrough')" title="Strikethrough" style="background:none;border:none;color:#ccc;font-size:13px;cursor:pointer;">S̶</button>
        <button onclick="document.execCommand('formatBlock', false, 'pre')" title="Code Block" style="background:none;border:none;color:#ccc;font-size:12px;cursor:pointer;">&lt;/&gt;</button>
        <button onclick="document.execCommand('insertOrderedList')" title="Numbered List" style="background:none;border:none;cursor:pointer;">
            <img src="https://img.icons8.com/ios-filled/16/cccccc/numbered-list.png" alt="Numbered List"/>
        </button>
        <button onclick="document.execCommand('insertUnorderedList')" title="Bullet List" style="background:none;border:none;cursor:pointer;">
            <img src="https://img.icons8.com/ios-filled/16/cccccc/bulleted-list.png" alt="Bullet List"/>
        </button>
        <button onclick="document.execCommand('hiliteColor', false, '#ccc')" title="Highlight Block" style="background:none;border:none;cursor:pointer;">
            <div style="width:10px;height:10px;background:#ccc;border-radius:2px;"></div>
        </button>
    </div>

    <div id="noteInput"
        contenteditable="true"
        data-placeholder="Type your note..."
        style="width:100%;height:60px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow-y:auto;background:white;color:black;position:relative;">
    </div>

    <div id="notesDisplay" 
        data-placeholder="Display notes..."
        style="width:100%;height:80px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;overflow-y:auto;background-color:white;color:black;position:relative;">
    </div>
</div>
`;
    if (!document.getElementById('notesPageStyles')) {
        const style = document.createElement('style');
        style.id = 'notesPageStyles';
        style.textContent = `
            #noteInput ol, #noteInput ul {
                padding-left: 20px;
                margin-left: 10px;
            }
            #noteInput:empty:before {
                content: attr(data-placeholder);
                color: #888;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                position: absolute;
                left: 8px;
                top: 8px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    const noteInput = document.getElementById('noteInput');
    const videoId = new URLSearchParams(window.location.search).get('v');
    const unsavedKey = `unsavedNote_${videoId}`;
    const savedNotesKey = `savedNotes_${videoId}`;
    let savedNotes = JSON.parse(localStorage.getItem(savedNotesKey)) || [];

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

    // 🟡 Load unsaved note
    const saved = localStorage.getItem(unsavedKey);
    noteInput.innerHTML = saved || '';

    noteInput.addEventListener('input', () => {
        localStorage.setItem(unsavedKey, noteInput.innerHTML);
    });

    document.getElementById('newNoteBtn').addEventListener('click', () => {
        noteInput.innerHTML = '';
        noteInput.focus();
        localStorage.removeItem(unsavedKey);
    });

    document.getElementById('saveNoteBtn').addEventListener('click', async () => {
        const token = localStorage.getItem('qboxai-access-token');
        if (!token) return showNoteMessage('Please login to save notes.', true);

        const noteContent = noteInput.innerHTML.trim();
        if (!noteContent) return showNoteMessage("Please enter some content for the note!", true);

        const video = document.querySelector('video');
        const seconds = video ? Math.floor(video.currentTime) : 0;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeStampFormatted = `${minutes}:${remainingSeconds}`;

        const noteData = {
            youtube_video_url: window.location.href,
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
                savedNotes.push(newNote);
                localStorage.setItem(savedNotesKey, JSON.stringify(savedNotes));
                appendNote(newNote);
            } else {
                const errorData = await response.json();
                showNoteMessage('Failed to save note! ' + (errorData.message || ''), true);
            }
        } catch (error) {
            console.error('Error:', error);
            showNoteMessage('Something went wrong while saving the note.', true);
        }
    });

    function formatSecondsToTimestamp(seconds) {
        if (typeof seconds === 'string' && seconds.includes(':')) {
            const [min, sec] = seconds.split(':');
            seconds = parseInt(min) * 60 + parseInt(sec);
        }
        seconds = Math.floor(Number(seconds));
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function displayNotes(notes) {
        const notesDisplayDiv = document.getElementById('notesDisplay');
        notesDisplayDiv.innerHTML = '';

        if (!notes || notes.length === 0) {
            notesDisplayDiv.innerHTML = '<p style="color:gray;text-align:center;">Display notes...</p>';
            return;
        }

        notes.forEach(note => appendNote(note));
    }

    function appendNote(note) {
        const notesDisplayDiv = document.getElementById('notesDisplay');
        const timeFormatted = formatSecondsToTimestamp(note.time_stamp);

        const noteDiv = document.createElement('div');
        noteDiv.style.cssText = 'margin-bottom: 16px; padding:8px; border:1px solid #ccc; border-radius:8px;';

        const timestampLink = document.createElement('div');
        timestampLink.textContent = `⏱️ ${timeFormatted}`;
        timestampLink.style.cssText = `color: #1976D2; font-weight: bold; cursor: pointer; text-decoration: underline; margin-bottom: 6px;`;
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
    }

    // Prevent YouTube spacebar issue
    document.addEventListener('keydown', (e) => {
        const isTyping = document.activeElement === noteInput || noteInput.contains(document.activeElement);
        const key = e.key.toLowerCase();
        if (isTyping) {
            if (e.ctrlKey && ['b', 'i', 'u'].includes(key)) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
            if (['t', 'i', 'f', 'j', 'k', 'l', 'm', 'c'].includes(key) || key === ' ') {
                e.stopImmediatePropagation();
                e.preventDefault();
                document.execCommand('insertText', false, key === ' ' ? ' ' : key);
            }
        }
    }, true);

    document.addEventListener('keyup', (e) => {
        const isTyping = document.activeElement === noteInput || noteInput.contains(document.activeElement);
        if (isTyping && e.key.toLowerCase() === ' ') {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);

    displayNotes(savedNotes);
}
