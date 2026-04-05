const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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
        adminMessages = [];
    }
}

// حفظ الرسائل في الملف
function saveMessages() {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(adminMessages, null, 2));
    console.log(`💾 تم حفظ ${adminMessages.length} رسالة`);
}

io.on('connection', (socket) => {
    console.log('✅ مستخدم متصل');

    // إرسال رسالة جديدة - تظهر للجميع
    socket.on('send-admin-message', (msg) => {
        console.log('📨 رسالة جديدة من:', msg.sender);
        adminMessages.push(msg);
        saveMessages();
        // تبث للجميع (أي أحد متصل)
        io.emit('admin-messages-update', adminMessages);
    });

    // طلب الرسائل - للمستخدم الجديد
    socket.on('get-admin-messages', () => {
        socket.emit('admin-messages-update', adminMessages);
    });
    
    // حذف رسالة (للمدير فقط)
    socket.on('delete-admin-message', (messageId) => {
        console.log('🗑️ جاري حذف الرسالة:', messageId);
        const index = adminMessages.findIndex(m => m.id == messageId);
        if (index !== -1) {
            adminMessages.splice(index, 1);
            saveMessages();
            // تبث التحديث للجميع
            io.emit('admin-messages-update', adminMessages);
            console.log('✅ تم حذف الرسالة نهائياً');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
    console.log(`📢 أي شخص يفتح الرابط يشوف الرسائل`);
});
