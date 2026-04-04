const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// بدل app.use(express.static('public')); استخدم هذا:
app.use(express.static(__dirname));  // يقرأ الملفات من نفس المجلد

let messages = [];

io.on('connection', (socket) => {
    socket.emit('old-messages', messages);

    socket.on('send-message', (msg) => {
        messages.push(msg);
        io.emit('new-message', msg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
