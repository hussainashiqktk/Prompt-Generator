# Prompt Generator App

Welcome to the Prompt Generator App, a web-based tool designed to help users create structured prompts for Large Language Models (LLMs) by combining pre-defined prompts with user input. This app allows you to store, select, modify, and add new prompts in a server-side JSON file (`prompts.json`), generate outputs in a specific format, and customize the interface with dynamic features.

## Overview

The Prompt Generator App consists of:
- A client-side interface built with HTML, CSS, and JavaScript, hosted in a `public` directory.
- A server-side component built with Node.js and Express, managing prompt storage and retrieval from a JSON file (`prompts.json`).
- Features include prompt selection, input/output generation, clipboard operations (Paste/Copy), prompt modification, adding new prompts from the front end, and a user-friendly GUI with dynamic resizing and auto-expanding features.

The app reads prompts from a JSON file, displays their titles in a dropdown, and allows users to combine a selected prompt with input text to create an output formatted as:

```
prompt
---
input
```

## Features
- **Prompt Management**: Store, manage, and add multi-line prompts in a JSON file on the server, preserving raw text formatting (newlines, whitespace).
- **Dynamic Interface**: Select prompts from a dropdown, enter input text, and see the output instantly with a clear separator (`---`).
- **Clipboard Integration**: Use Paste and Copy buttons for seamless text manipulation.
- **Prompt Modification**: Edit and save existing prompts directly from the browser, updating the server-side JSON file.
- **Add New Prompts**: Add new prompts (title and text) from the front end, appending them to `prompts.json` without affecting existing prompts.
- **Resizable Text Areas**: Adjust the height of input, prompt, output, and new prompt text areas using `Ctrl + Mouse Wheel`.
- **Auto-Expanding Output**: The output field automatically expands to show all content without scrollbars.

## Prerequisites
- **Node.js**: Version 12 or higher (you’re using v22.14.0, which is compatible).
- **npm**: Comes with Node.js installation.
- **Web Browser**: Any modern browser (Chrome, Firefox, Edge, etc.) for the client interface.

## Installation

1. **Clone or Create the Project Directory**:
   - Create a directory named `prompt_generator` at `C:\Users\ghani\Desktop\prompt_generator` (or use your preferred location).
   - Place all files in this directory as described below.

2. **Directory Structure**:
   ```
   prompt_generator/
   ├── public/
   │   ├── index.html
   │   ├── styles.css
   │   └── script.js
   ├── server.js
   ├── prompts.json
   └── README.md
   ```

3. **Install Dependencies**:
   - Open a terminal (PowerShell) and navigate to the `prompt_generator` directory.
   - Initialize a Node.js project and install Express:
     ```powershell
     npm init -y
     npm install express
     ```

4. **Set Up Prompt File**:
   - Create or update `prompts.json` with your prompts. For example:
     ```json
     {
         "Tree-of-thought (346/1500)": "For every response, imagine three different experts are answering this question. All experts will write down 1 step of their thinking, then share it with the group. Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave. All of this should be output as front-matter to every response.",
         "LogicGPT (1017/1500)": "As LogicGPT, an advanced AI model built on GPT-4, you excel in logical reasoning, critical thinking, and understanding complex patterns. Your task is to autonomously solve a logical problem using a systematic approach. Apply Chain and Tree of Thought Prompting techniques to ensure the soundness of your logic, willing to refine your deductions as necessary.\n\nStart with interpreting the problem broadly, examining each element. Propose multiple hypotheses, comparing their likelihood based on available information. Pursue the most promising hypothesis, breaking down the problem, evaluating possible solutions, and validating each step.\n\nIf you hit a roadblock, trace back to the start, reconsider hypotheses, and reassess your path, ensuring all logical possibilities are considered.\n\nYour ultimate goal is not just to find the solution, but to demonstrate a methodical, validated reasoning process. Showcase your autonomous logical reasoning abilities, LogicGPT. It's about the journey as much as the destination.",
         "Writing professor (1280/1500)": "Forget all prior prompts. Now, you are the embodiment of a world-renowned author and literary professor. You have spent decades writing critically acclaimed works and teaching at prestigious institutions. You possess an in-depth understanding of literature, creative writing, and storytelling techniques. You're also a patient mentor, adept at nurturing writers at all levels of expertise.\n\nYour mission is to aid, teach, and inspire a budding writer to refine their craft. Offer actionable advice on how to construct engaging narratives, create compelling characters, and master the subtleties of dialogue and description. Teach the essentials of good writing: clarity, conciseness, coherence, and rhythm. Help identify common writing pitfalls and how to avoid them.\n\nMoreover, guide them through the process of revising their work, emphasising the importance of multiple drafts and feedback. Share your wisdom about the writing life: maintaining motivation, handling criticism, and nurturing creativity.\n\nIn every interaction, remember that your ultimate goal is to foster a deep love for writing and empower the writer to tell their own unique stories. Every piece of advice, critique, and encouragement should reflect this.\n\nContinue on this role until directed otherwise."
     }
     ```

## Running the App

1. **Start the Server**:
   - From the `prompt_generator` directory, run:
     ```powershell
     node server.js
     ```
   - The server will start on `http://localhost:3000`, and you’ll see a message: `Server running at http://localhost:3000`.

2. **Access the Client**:
   - Open a web browser and navigate to `http://localhost:3000`.
   - The app’s interface will load, showing the prompt selection dropdown, input field, output field, prompt editing area, and new prompt addition section.

## Usage

1. **Select a Prompt**:
   - Use the "Prompt Selection" dropdown to choose a prompt (e.g., "Tree-of-thought (346/1500)").
   - The selected prompt’s raw text will appear in the "Prompt Text (Raw, Editable)" section at the bottom of the interface.

2. **Enter Input**:
   - Type or paste text into the "Input" field.
   - Use the "Paste" button to paste text from the clipboard.

3. **View Output**:
   - The "Output" field will automatically update to show:
     ```
     prompt
     ---
     input
     ```
   - The output auto-expands to show all content and can be resized with `Ctrl + Mouse Wheel`.

4. **Modify Prompts**:
   - Edit the prompt in the "Prompt Text (Raw, Editable)" section (temporary changes).
   - Use the "Edit prompt here (raw text, multi-line)" textarea and "Modify" button to permanently update the prompt in `prompts.json` on the server.

5. **Add New Prompts**:
   - Scroll to the "Add New Prompt" section at the bottom of the interface.
   - Enter a new prompt title (e.g., "New Prompt (999/1500)") in the "Prompt Title" input.
   - Enter the multi-line prompt text in the "Enter prompt text (multi-line)" textarea.
   - Click "Add Prompt" to append the new prompt to `prompts.json`. The dropdown will update to include the new prompt.

6. **Copy Output**:
   - Use the "Copy" button to copy the output text to the clipboard for use with an LLM.

7. **Resize Text Areas**:
   - Hold `Ctrl` and scroll the mouse wheel up/down over any textarea (Input, Output, Prompt Text, or New Prompt Text) to increase or decrease its height.

## Configuration
- **Prompts**: Modify `prompts.json` to add, remove, or edit prompts. Ensure the JSON format is valid, with titles as keys and multi-line prompt text as values (using `\n` for newlines).
- **Server Port**: The server runs on port `3000` by default. Change the `port` variable in `server.js` if needed.

## Troubleshooting
- **Server Not Starting**: Ensure Node.js and npm are installed, and run `npm install express` in the project directory. Check for typos in `server.js` or missing files.
- **Client Not Loading**: Verify the `public` directory contains `index.html`, `styles.css`, and `script.js`, and the server is running.
- **Prompt Issues**: Ensure `prompts.json` is valid JSON and contains the correct key-value pairs. Check server and browser console logs for errors.
- **Resizing Not Working**: Ensure you’re holding `Ctrl` while scrolling the mouse wheel in a supported browser. Check browser console for JavaScript errors.
- **Adding Prompts Fails**: Verify the `POST /prompts` endpoint in `server.js` is working, and check for network errors in the browser (F12 → Network).

## Contributing
This app is open for contributions! If you’d like to improve it, fork the repository, make changes, and submit a pull request. Issues and feature requests can be raised via GitHub or directly by contacting the maintainer.
