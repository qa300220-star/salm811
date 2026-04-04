const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

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
