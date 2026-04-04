const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let adminMessages = [];

io.on('connection', (socket) => {
    console.log('✅ مستخدم متصل');

    socket.on('send-admin-message', (msg) => {
        adminMessages.push(msg);
        io.emit('admin-messages-update', adminMessages);
    });

    socket.on('get-admin-messages', () => {
        socket.emit('admin-messages-update', adminMessages);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
