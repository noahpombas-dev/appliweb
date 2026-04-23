const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const MAX_MESSAGES = 9;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// NACHRICHTEN-DATEI VORBEREITEN
// ===============================
const messagesFile = path.join(__dirname, 'messages.json');
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify([]));
}

// ===============================
// API: NACHRICHTEN ABRUFEN
// ===============================
app.get('/api/messages', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesFile));
    res.json(messages);
});

// ===============================
// API: NEUE NACHRICHT SPEICHERN
// ===============================
app.post('/api/messages', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesFile));
    const newMessage = req.body;

    messages.unshift(newMessage);

    if (messages.length > MAX_MESSAGES) {
        messages.pop();
    }

    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    res.status(201).json({ success: true });
});

// ===============================
// SERVER STARTEN
// ===============================
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
