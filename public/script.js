// Base URL for the server API (adjust this to match your server)
const API_URL = 'http://localhost:3000'; // Example server URL

// Load prompts from the server when the page loads
async function loadPrompts() {
    try {
        const response = await fetch(`${API_URL}/prompts`);
        const titles = await response.json();
        console.log('Prompt titles from server:', titles); // Debugging
        populatePromptSelect(titles);
    } catch (error) {
        console.error('Error loading prompts:', error);
        alert('Failed to load prompts. Please check the server.');
    }
}

// Populate the prompt select dropdown
function populatePromptSelect(titles) {
    const select = document.getElementById('promptSelect');
    select.innerHTML = '<option value="">Select a prompt</option>'; // Clear existing options
    titles.forEach(title => {
        const option = document.createElement('option');
        option.value = encodeURIComponent(title);
        option.textContent = title;
        select.appendChild(option);
        console.log(`Added option: ${title}`);
    });
}

// Update output when input or prompt changes, and auto-expand output textarea
function updateOutput() {
    const inputText = document.getElementById('inputText').value;
    const promptText = document.getElementById('promptText').textContent.trim();
    let output = '';
    if (promptText && inputText) {
        output = `${promptText}\n---\n${inputText}`;
    } else if (promptText) {
        output = promptText;
    } else if (inputText) {
        output = inputText;
    } else {
        output = '';
    }
    const outputTextarea = document.getElementById('outputText');
    outputTextarea.value = output;
    console.log('Updated output:', output); // Debugging
    // Auto-expand output textarea to fit content
    outputTextarea.style.height = 'auto'; // Reset height
    outputTextarea.style.height = `${outputTextarea.scrollHeight}px`; // Set height to content height
}

// Handle prompt selection
document.getElementById('promptSelect').addEventListener('change', async function() {
    const title = decodeURIComponent(this.value);
    console.log(`Selected prompt: ${title}`); // Debugging
    if (title) {
        try {
            const response = await fetch(`${API_URL}/prompts/${encodeURIComponent(title)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const prompt = await response.text();
            console.log(`Fetched prompt for ${title}: "${prompt}"`); // Debugging
            document.getElementById('promptText').textContent = prompt.replace(/\n/g, '\n'); // Preserve newlines
        } catch (error) {
            console.error('Error fetching prompt:', error);
            alert('Failed to load the selected prompt. Check the server logs.');
        }
    } else {
        document.getElementById('promptText').textContent = "";
    }
    updateOutput();
});

// Handle input changes
document.getElementById('inputText').addEventListener('input', updateOutput);

// Handle prompt text changes (via contenteditable pre tag)
document.getElementById('promptText').addEventListener('input', function() {
    updateOutput();
    // This change is temporary until Modify is clicked
    console.log('Prompt text edited:', this.textContent.trim());
});

// Handle Ctrl + Mouse Wheel for resizing textareas
const textAreas = ['inputText', 'promptText', 'outputText', 'newPromptText'].map(id => document.getElementById(id));
textAreas.forEach(textarea => {
    textarea.addEventListener('wheel', (event) => {
        if (event.ctrlKey) {
            event.preventDefault();
            const delta = event.deltaY > 0 ? -1 : 1; // Scroll down decreases rows, scroll up increases
            let currentRows = parseInt(textarea.getAttribute('rows') || 4, 10); // Default to 4 rows
            currentRows = Math.max(1, currentRows + delta); // Ensure at least 1 row
            textarea.setAttribute('rows', currentRows);
            if (textarea.id === 'outputText') {
                // Ensure output textarea auto-expands after row change
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
            console.log(`Resized ${textarea.id} to ${currentRows} rows`);
        }
    });
});

// Paste functionality
document.getElementById('pasteButton').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputText').value = text;
        updateOutput();
        console.log('Pasted text:', text);
    } catch (err) {
        console.error('Failed to paste:', err);
    }
});

// Copy functionality
document.getElementById('copyButton').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('outputText').value);
    console.log('Copied output:', document.getElementById('outputText').value);
});

// Modify prompt (updates server-side file)
document.getElementById('modifyButton').addEventListener('click', async () => {
    const title = decodeURIComponent(document.getElementById('promptSelect').value);
    const newPrompt = document.getElementById('editPromptInput').value.trim();
    if (title && newPrompt) {
        try {
            const response = await fetch(`${API_URL}/prompts/${encodeURIComponent(title)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: newPrompt
            });
            if (response.ok) {
                document.getElementById('promptText').textContent = newPrompt.replace(/\n/g, '\n'); // Preserve newlines
                document.getElementById('editPromptInput').value = ''; // Clear input
                alert(`Prompt "${title}" updated successfully!`);
                updateOutput();
                console.log(`Modified prompt ${title} to: "${newPrompt}"`);
            } else {
                throw new Error('Failed to update prompt');
            }
        } catch (error) {
            console.error('Error modifying prompt:', error);
            alert('Failed to modify the prompt. Please check the server logs.');
        }
    } else {
        alert('Please select a prompt and enter a new prompt text before modifying.');
    }
});

// Add new prompt (appends to server-side file)
document.getElementById('addPromptButton').addEventListener('click', async () => {
    const title = document.getElementById('newPromptTitle').value.trim();
    const promptText = document.getElementById('newPromptText').value.trim();
    if (title && promptText) {
        try {
            const response = await fetch(`${API_URL}/prompts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, prompt: promptText })
            });
            if (response.ok) {
                alert(`Prompt "${title}" added successfully!`);
                document.getElementById('newPromptTitle').value = ''; // Clear title input
                document.getElementById('newPromptText').value = ''; // Clear prompt text input
                // Reload prompts to update the dropdown
                loadPrompts();
            } else {
                throw new Error('Failed to add prompt');
            }
        } catch (error) {
            console.error('Error adding prompt:', error);
            alert('Failed to add the prompt. Please check the server logs.');
        }
    } else {
        alert('Please enter both a prompt title and text before adding.');
    }
});

// Load prompts on page load
window.onload = loadPrompts;