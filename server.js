const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ملف حفظ الرسائل
const MESSAGES_FILE = path.join(__dirname, 'adminMessages.json');

// تحميل الرسائل من الملف عند بدء التشغيل
let adminMessages = [];
if (fs.existsSync(MESSAGES_FILE)) {
    try {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        adminMessages = JSON.parse(data);
        console.log(`✅ تم تحميل ${adminMessages.length} رسالة من الملف`);
    } catch(e) {
        console.error('خطأ في تحميل الملف:', e);
        adminMessages = [];
    }
} else {
    console.log('📁 لم يتم العثور على ملف الرسائل، سيتم إنشاؤه تلقائياً');
}

// حفظ الرسائل في الملف
function saveMessages() {
    try {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(adminMessages, null, 2));
        console.log(`💾 تم حفظ ${adminMessages.length} رسالة`);
    } catch(e) {
        console.error('خطأ في حفظ الملف:', e);
    }
}

// إرسال آخر تحديث للرسائل عند الاتصال
io.on('connection', (socket) => {
    console.log('🟢 مستخدم جديد متصل:', socket.id);
    
    // إرسال الرسائل الحالية للعميل الجديد
    socket.emit('admin-messages-update', adminMessages);
    
    // استقبال رسالة جديدة من العميل
    socket.on('send-admin-message', (msg) => {
        console.log('📨 رسالة جديدة من:', msg.sender);
        adminMessages.push(msg);
        saveMessages();  // حفظ في الملف فوراً
        io.emit('admin-messages-update', adminMessages); // بث للجميع
    });
    
    // حذف رسالة (للمدير فقط)
    socket.on('delete-admin-message', (messageId) => {
        console.log('🗑️ حذف رسالة:', messageId);
        const index = adminMessages.findIndex(m => m.id == messageId);
        if (index !== -1) {
            // إما الحذف الفعلي أو وضع علامة محذوفة
            adminMessages.splice(index, 1);
            saveMessages();  // حفظ التعديل
            io.emit('admin-messages-update', adminMessages); // بث التحديث للجميع
        }
    });
    
    // حذف نهائي مع إظهار نص "تم الحذف"
    socket.on('soft-delete-message', (messageId) => {
        console.log('🔇 حذف ناعم للرسالة:', messageId);
        const msg = adminMessages.find(m => m.id == messageId);
        if (msg && !msg.deleted) {
            msg.deleted = true;
            msg.deletedAt = new Date().toLocaleString('ar-SA');
            saveMessages();
            io.emit('admin-messages-update', adminMessages);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('🔴 مستخدم غادر:', socket.id);
    });
});

// تقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});
