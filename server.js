const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// ظ…ظ„ظپ طظپط¸ ط§ظ„ط±ط³ط§ط¦ظ„
const MESSAGES_FILE = path.join(__dirname, 'adminMessages.json');

// طھطظ…ظٹظ‹ ط§ظ‹ط±ط³ط§ط¦ظ‹ ط§ظ‹ظ…طظپظˆط¸ط©
let adminMessages = [];
إذا كان ملف الرسائل موجودًا في نظام الملفات (fs.existsSync(MESSAGES_FILE)) {
    يحاول {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        adminMessages = JSON.parse(data);
        console.log(`ًں“¥ طھظ… طھطظ…ظٹظ„ ${adminMessages.length} ط±ط³ط§ظ„ط©`);
    } catch(e) {
        console.log('ط®ط·ط £ ظپظٹ طھطظ…ظٹظ‹ ط§ظ‹ط±ط³ط§ط¦ظ„');
    }
}

// طظپط¸ ط§ظ‹ط±ط³ط§ط¦ظ‹ ظپظٹ ط§ظ‹ظ…ظ‹ظپ
دالة حفظ الرسائل() {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(adminMessages, null, 2));
    console.log(`ًں'¾ طھظ… طظپط¸ ${adminMessages.length} ط±ط³ط§ظ„ط©`);
}

io.on('connection', (socket) => {
    console.log('âœ… ظ…ط³طھط®ط¯ظ… ظ…طھط¯ظ„');

    // ط¥ط±ط³ط§ظ„ ط±ط³ط§ظ„ط© ط¬ط¯ظٹط¯ط©
    socket.on('send-admin-message', (msg) => {
        adminMessages.push(msg);
        saveMessages();
        io.emit('admin-messages-update', adminMessages);
    });

    // ط·ظ‹ط¨ ط§ظ‹ط±ط³ط§ط¦ظ‹
    socket.on('get-admin-messages', () => {
        socket.emit('admin-messages-update', adminMessages);
    });
    
    // œ… ط¥ط¶ط§ظپط© طط¯ط« ط§ظ„طط°ظپ (ظ‡ط°ط§ ظ‡ظˆ ط§ظ„ظ…ط·ظ„ظˆط¨)
    socket.on('delete-admin-message', (messageId) => {
        console.log('ًں—'ï¸ڈ ط¬ط§ط±ظٹ طط°ظپ ط§ظ‹ط±ط³ط§ظ‹ط©:', messageId);
        const index = adminMessages.findIndex(m => m.id == messageId);
        إذا كان (الفهرس !== -1) {
            adminMessages.splice(index, 1); // طط°ظپ ظ†ظ‡ط§ط¦ظٹ
            saveMessages(); // طظپط¸ ط§ظ‹طھط؛ظٹظٹط±
            io.emit('admin-messages-update', adminMessages); // طھطط¯ظٹط« ط§ظ„ط¬ظ…ظٹط¹
            console.log('œ… طھظ… طط°ظپ ط§ظ„ط±ط³ط§ظ‹ط© ظ†ظ‡ط§ط¦ظٹط§ظ‹');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`الخادم على المنفذ ${PORT}`));
