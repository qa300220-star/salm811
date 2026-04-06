const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// رابط MongoDB (استبدل كلمة السر)
const uri = "mongodb+srv://dbdbbddbdbdbdb501_db_user:123456789@cluster0.7mek47o.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);
let db;
let adminMessagesCollection;

// الاتصال بقاعدة البيانات
async function connectDB() {
    try {
        await client.connect();
        console.log('✅ متصل بـ MongoDB Atlas');
        db = client.db('salem_tech');
        adminMessagesCollection = db.collection('admin_messages');
        console.log('✅ قاعدة البيانات جاهزة');
    } catch(e) {
        console.log('❌ خطأ في الاتصال:', e.message);
    }
}
connectDB();

// جلب كل الرسائل من MongoDB
async function getAllMessages() {
    try {
        return await adminMessagesCollection.find({}).toArray();
    } catch(e) {
        console.log('خطأ في جلب الرسائل:', e);
        return [];
    }
}

io.on('connection', async (socket) => {
    console.log('✅ مستخدم متصل');

    // إرسال رسالة جديدة
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
            console.log(`📨 رسالة جديدة من: ${msg.sender}`);
            
            // جلب كل الرسائل بعد الإضافة
            const allMessages = await getAllMessages();
            io.emit('admin-messages-update', allMessages);
        } catch(e) {
            console.log('❌ خطأ في حفظ الرسالة:', e);
        }
    });

    // طلب الرسائل (للمستخدم الجديد)
    socket.on('get-admin-messages', async () => {
        const allMessages = await getAllMessages();
        socket.emit('admin-messages-update', allMessages);
        console.log(`📤 تم إرسال ${allMessages.length} رسالة`);
    });
    
    // حذف رسالة
    socket.on('delete-admin-message', async (messageId) => {
        console.log('🗑️ جاري حذف الرسالة:', messageId);
        try {
            const result = await adminMessagesCollection.deleteOne({ id: messageId });
            if (result.deletedCount > 0) {
                console.log('✅ تم حذف الرسالة نهائياً');
                const allMessages = await getAllMessages();
                io.emit('admin-messages-update', allMessages);
            } else {
                console.log('⚠️ لم يتم العثور على الرسالة');
            }
        } catch(e) {
            console.log('❌ خطأ في حذف الرسالة:', e);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
