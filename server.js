const fs = require('fs');

// ملف حفظ الرسائل
const MESSAGES_FILE = './adminMessages.json';

// تحميل الرسائل من الملف عند بدء التشغيل
let adminMessages = [];
if (fs.existsSync(MESSAGES_FILE)) {
    const data = fs.readFileSync(MESSAGES_FILE);
    adminMessages = JSON.parse(data);
}

// حفظ الرسائل في الملف كل ما تتغير
function saveMessages() {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(adminMessages));
}

// عند إرسال رسالة جديدة
socket.on('send-admin-message', (msg) => {
    adminMessages.push(msg);
    saveMessages();  // حفظ في الملف
    io.emit('admin-messages-update', adminMessages);
});

// عند حذف رسالة
socket.on('delete-admin-message', (id) => {
    adminMessages = adminMessages.filter(m => m.id !== id);
    saveMessages();  // حفظ التعديل
    io.emit('admin-messages-update', adminMessages);
});
