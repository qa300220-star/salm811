const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.static('public'));

// رابط MongoDB مع كلمة المرور 123456789
const uri = "mongodb+srv://dbdbbddbdbdbdb501_db_user:123456789@cluster0.7mek47o.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);
let db;
let adminMessagesCollection;

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ متصل بـ MongoDB Atlas');
        db = client.db('salem_tech');
        adminMessagesCollection = db.collection('admin_messages');
        
        // عمل index على الوقت
        await adminMessagesCollection.createIndex({ createdAt: -1 });
        
        console.log('✅ قاعدة البيانات جاهزة');
    } catch(e) {
        console.log('❌ خطأ في الاتصال بقاعدة البيانات:', e.message);
    }
}

connectDB();

io.on('connection', (socket) => {
    console.log('✅ مستخدم متصل');

    // ========== رسائل الإدارة ==========
    
    // إرسال رسالة جديدة للإدارة
    socket.on('send-admin-message', async (msg) => {
        const adminMsg = {
            id: Date.now(),
            sender: msg.sender,
            message: msg.message,
            time: new Date().toLocaleString('ar-SA'),
            createdAt: new Date()
        };
        
        try {
            await adminMessagesCollection.insertOne(adminMsg);
            console.log('📨 تم استلام رسالة جديدة من:', msg.sender);
            
            // جلب جميع الرسائل بعد الإضافة
            const allMessages = await adminMessagesCollection.find({})
                .sort({ createdAt: -1 })
                .toArray();
            io.emit('admin-messages-update', allMessages);
        } catch(e) {
            console.log('❌ خطأ في حفظ رسالة الإدارة:', e.message);
        }
    });

    // طلب جميع رسائل الإدارة
    socket.on('get-admin-messages', async () => {
        try {
            const allMessages = await adminMessagesCollection.find({})
                .sort({ createdAt: -1 })
                .toArray();
            socket.emit('admin-messages-update', allMessages);
            console.log(`📤 تم إرسال ${allMessages.length} رسالة إدارة`);
        } catch(e) {
            console.log('❌ خطأ في جلب رسائل الإدارة:', e.message);
            socket.emit('admin-messages-update', []);
        }
    });
    
    // حذف رسالة إدارة (للمدير فقط)
    socket.on('delete-admin-message', async (messageId) => {
        console.log('🗑️ جاري حذف الرسالة:', messageId);
        try {
            const result = await adminMessagesCollection.deleteOne({ id: messageId });
            if (result.deletedCount > 0) {
                console.log('✅ تم حذف الرسالة نهائياً');
                
                // إرسال التحديث للجميع
                const allMessages = await adminMessagesCollection.find({})
                    .sort({ createdAt: -1 })
                    .toArray();
                io.emit('admin-messages-update', allMessages);
            } else {
                console.log('⚠️ لم يتم العثور على الرسالة');
            }
        } catch(e) {
            console.log('❌ خطأ في حذف الرسالة:', e.message);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 سيرفر رسائل الإدارة يعمل على http://localhost:${PORT}`);
});
