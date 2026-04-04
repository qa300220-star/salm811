const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// ملف حفظ الرسائل
const MESSAGES_FILE = path.join(__dirname, 'adminMessages.json');

// تحميل الرسائل المحفوظة
let adminMessages = [];
if (fs.existsSync(MESSAGES_FILE)) {
    try {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        adminMessages = JSON.parse(data);
        console.log(`📥 تم تحميل ${adminMessages.length} رسالة`);
    } catch(e) {
        console.log('خطأ في تحميل الرسائل');
    }
}

// حفظ الرسائل في الملف
function saveMessages() {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(adminMessages, null, 2));
    console.log(`💾 تم حفظ ${adminMessages.length} رسالة`);
}

io.on('connection', (socket) => {
    console.log('✅ مستخدم متصل');

    // إرسال رسالة جديدة
    socket.on('send-admin-message', (msg) => {
        adminMessages.push(msg);
        saveMessages();  // حفظ في الملف
        io.emit('admin-messages-update', adminMessages);
    });

    // طلب الرسائل
    socket.on('get-admin-messages', () => {
        socket.emit('admin-messages-update', adminMessages);
    });
    
    // 🔴 تم إزالة حدث delete-admin-message نهائياً 🔴
    // لا يوجد حذف للرسائل أبداً
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
