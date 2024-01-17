// server.js

const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

function loadReplies(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split('\n');
        const replyMap = new Map();

        lines.forEach((line) => {
            const [word, reply] = line.split(';');

            if (word && reply) {
                replyMap.set(word.trim(), reply.trim());
            }
        });

        return replyMap;
    } catch (error) {
        console.error('Error reading the file:', error);
        process.exit(1); // Terminate the application on error
    }
}

const replies = loadReplies('replies.txt');

app.get('/getReply/:word', (req, res) => {
    const word = req.params.word.toLowerCase();

    if (replies.has(word)) {
        res.json({ reply: replies.get(word) });
    } else {
        res.status(404).send('Reply not found');
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
