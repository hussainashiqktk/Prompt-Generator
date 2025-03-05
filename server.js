const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (if needed)
app.use(express.json()); // Handle JSON requests
app.use(express.text()); // Handle plain text requests for PUT

// Path to prompts file
const promptsFile = path.join(__dirname, 'prompts.json');

// Read prompts from JSON file
function readPrompts() {
    if (!fs.existsSync(promptsFile)) {
        fs.writeFileSync(promptsFile, JSON.stringify({
            "Tree-of-thought (346/1500)": "For every response, imagine three different experts are answering this question. All experts will write down 1 step of their thinking, then share it with the group. Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave. All of this should be output as front-matter to every response.",
            "LogicGPT (1017/1500)": "As LogicGPT, an advanced AI model built on GPT-4, you excel in logical reasoning, critical thinking, and understanding complex patterns. Your task is to autonomously solve a logical problem using a systematic approach. Apply Chain and Tree of Thought Prompting techniques to ensure the soundness of your logic, willing to refine your deductions as necessary.\n\nStart with interpreting the problem broadly, examining each element. Propose multiple hypotheses, comparing their likelihood based on available information. Pursue the most promising hypothesis, breaking down the problem, evaluating possible solutions, and validating each step.\n\nIf you hit a roadblock, trace back to the start, reconsider hypotheses, and reassess your path, ensuring all logical possibilities are considered.\n\nYour ultimate goal is not just to find the solution, but to demonstrate a methodical, validated reasoning process. Showcase your autonomous logical reasoning abilities, LogicGPT. It's about the journey as much as the destination.",
            "Writing professor (1280/1500)": "Forget all prior prompts. Now, you are the embodiment of a world-renowned author and literary professor. You have spent decades writing critically acclaimed works and teaching at prestigious institutions. You possess an in-depth understanding of literature, creative writing, and storytelling techniques. You're also a patient mentor, adept at nurturing writers at all levels of expertise.\n\nYour mission is to aid, teach, and inspire a budding writer to refine their craft. Offer actionable advice on how to construct engaging narratives, create compelling characters, and master the subtleties of dialogue and description. Teach the essentials of good writing: clarity, conciseness, coherence, and rhythm. Help identify common writing pitfalls and how to avoid them.\n\nMoreover, guide them through the process of revising their work, emphasising the importance of multiple drafts and feedback. Share your wisdom about the writing life: maintaining motivation, handling criticism, and nurturing creativity.\n\nIn every interaction, remember that your ultimate goal is to foster a deep love for writing and empower the writer to tell their own unique stories. Every piece of advice, critique, and encouragement should reflect this.\n\nContinue on this role until directed otherwise."
        }, null, 2));
    }
    return JSON.parse(fs.readFileSync(promptsFile, 'utf8'));
}

// Get all prompt titles
app.get('/prompts', (req, res) => {
    const prompts = readPrompts();
    const titles = Object.keys(prompts);
    console.log('Prompt titles:', titles); // Debugging
    res.json(titles); // Return an array of titles as JSON
});

// Get a specific prompt
app.get('/prompts/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title);
    const prompts = readPrompts();
    console.log(`Fetching prompt for ${title}:`, prompts[title] || 'Not found'); // Debugging
    if (prompts[title]) {
        res.send(prompts[title]);
    } else {
        res.status(404).send('Prompt not found');
    }
});

// Update a specific prompt
app.put('/prompts/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title);
    const newPrompt = req.body;
    const prompts = readPrompts();

    console.log(`Updating prompt ${title} to: "${newPrompt}"`); // Debugging
    if (prompts[title]) {
        prompts[title] = newPrompt;
        fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));
        console.log('Updated prompts file:', JSON.stringify(prompts, null, 2)); // Debugging
        res.send('Prompt updated successfully');
    } else {
        res.status(404).send('Prompt not found');
    }
});

// Add a new prompt
app.post('/prompts', (req, res) => {
    const { title, prompt } = req.body;
    if (!title || !prompt) {
        return res.status(400).send('Title and prompt text are required');
    }

    const prompts = readPrompts();
    if (prompts[title]) {
        return res.status(409).send('A prompt with this title already exists');
    }

    prompts[title] = prompt;
    fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2));
    console.log(`Added new prompt: ${title} -> "${prompt}"`);
    console.log('Updated prompts file:', JSON.stringify(prompts, null, 2)); // Debugging
    res.send('Prompt added successfully');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});