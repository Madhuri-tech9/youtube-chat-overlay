(function () {
    let overlay = null;
    let vnButton = null;

    function createVNButton() {
        if (vnButton) return;

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
        if (overlay) return;

        overlay = document.createElement('div');
        overlay.id = 'my-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 130px;
            right: 20px;
            width: 320px;
            height: 400px;
            background: #f0f0d8;
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
        header.innerHTML = `<span>MY APP</span>`;
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
        if (overlay) overlay.remove();
        if (vnButton) vnButton.remove();
        overlay = null;
        vnButton = null;
    }

    function checkAndInject() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('youtube.com/watch')) {
            createVNButton();
            createOverlay();
        } else {
            removeOverlayAndButton();
        }
    }

    function switchTab(tabName) {
        const tabContentDiv = document.getElementById('tabContent');
        document.querySelectorAll('#my-overlay button').forEach(btn => {
            if (['Q/A', 'clip', 'notes'].includes(btn.innerText)) {
                btn.style.background = btn.innerText.toLowerCase() === tabName.toLowerCase() ? '#FFEB3B' : 'black';
                btn.style.color = btn.innerText.toLowerCase() === tabName.toLowerCase() ? 'black' : 'white';
            }
        });

        if (tabName.toLowerCase() === 'q/a') {
            tabContentDiv.innerHTML = `
                <textarea id="questionInput" placeholder="Ask your question here..." style="width:100%;height:60px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
                <div style="display:flex;justify-content:flex-end;margin-top:8px;">
                    <button id="sendQuestionBtn" style="background:#FFEB3B;color:black;padding:6px 14px;font-weight:bold;border:2px solid black;border-radius:8px;font-size:12px;cursor:pointer;">Send</button>
                </div>
                <h4 style="margin-top:10px;">Answer:</h4>
                <textarea id="answerOutput" readonly style="width:100%;height:80px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
            `;

            document.getElementById('sendQuestionBtn').addEventListener('click', async () => {
                const question = document.getElementById('questionInput').value.trim();
                const answerBox = document.getElementById('answerOutput');
                if (!question) {
                    alert('Please enter a question!');
                    return;
                }

                try {
                    answerBox.value = 'Loading...';
                    const response = await fetch('http://localhost:5000/ask', { // Replace URL if needed
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ question }),
                    });

                    if (!response.ok) {
                        throw new Error('Server error');
                    }

                    const data = await response.json();
                    answerBox.value = data.answer || 'No answer received.';
                } catch (error) {
                    console.error(error);
                    answerBox.value = 'Error getting answer.';
                }
            });
        } else if (tabName.toLowerCase() === 'clip') {
            tabContentDiv.innerHTML = `
                <textarea placeholder="Select or paste clip content here..." style="width:100%;height:60px;padding:8px;margin-top:10px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
                <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;">
                    <button style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Analyze Clip</button>
                    <button style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Save Clip</button>
                    <button style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Share Clip</button>
                </div>
                <h4 style="margin-top:10px;">Clip Analysis:</h4>
                <textarea readonly style="width:100%;height:80px;padding:8px;margin-top:4px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
            `;
        } else if (tabName.toLowerCase() === 'notes') {
            tabContentDiv.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
                    <div style="display:flex;gap:6px;justify-content:center;">
                        <button id="newNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">New Note</button>
                        <button id="saveNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Save</button>
                        <button id="deleteNoteBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Delete</button>
                        <button id="exportNotesBtn" style="background:#FFEB3B;color:black;padding:6px 10px;font-weight:bold;border:2px solid black;border-radius:10px;font-size:11px;cursor:pointer;">Export Notes</button>
                    </div>
                    <textarea id="notesDisplay" readonly style="width:100%;height:60px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;">- Meeting Notes\n- Project Ideas\n- Research Notes</textarea>
                    <textarea id="noteInput" placeholder="Note Content..." style="width:100%;height:60px;padding:8px;border-radius:8px;border:2px solid #FFEB3B;box-sizing:border-box;"></textarea>
                </div>
            `;

            document.getElementById('newNoteBtn').addEventListener('click', () => {
                document.getElementById('noteInput').value = ''; // Clear current input field
                document.getElementById('noteInput').focus();
            });

            document.getElementById('saveNoteBtn').addEventListener('click', () => {
                const noteContent = document.getElementById('noteInput').value.trim();
                if (noteContent) {
                    // Save the note (for now just in localStorage)
                    const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
                    existingNotes.push(noteContent);
                    localStorage.setItem('notes', JSON.stringify(existingNotes));

                    // Display updated notes
                    document.getElementById('notesDisplay').value = existingNotes.join('\n');
                    document.getElementById('noteInput').value = ''; // Clear input
                } else {
                    alert("Please enter some content for the note!");
                }
            });

            document.getElementById('deleteNoteBtn').addEventListener('click', () => {
                // Clear all notes (both UI and localStorage)
                localStorage.removeItem('notes');
                document.getElementById('notesDisplay').value = '';
            });

            document.getElementById('exportNotesBtn').addEventListener('click', () => {
                const notes = JSON.parse(localStorage.getItem('notes')) || [];
                const blob = new Blob([notes.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'notes.txt';
                a.click();
                URL.revokeObjectURL(url);
            });

            // Load existing notes when switching to the Notes tab
            const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
            document.getElementById('notesDisplay').value = existingNotes.join('\n');
        }
    }

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndInject();
        }
    }, 1000);

    checkAndInject();
})();
