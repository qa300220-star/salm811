const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

// رابط MongoDB (خليه كذا)
const uri = process.env.MONGODB_URI || "mongodb+srv://dbdbbddbdbdbdb501_db_user:123456789@cluster0.7mek47o.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);
let db;
let adminMessagesCollection;

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ متصل بـ MongoDB');
        db = client.db('salem_tech');
        adminMessagesCollection = db.collection('admin_messages');
        console.log('✅ قاعدة البيانات جاهزة');
    } catch(e) {
        console.log('❌ خطأ:', e.message);
    }
}
connectDB();

async function getAllMessages() {
    try {
        return await adminMessagesCollection.find({}).toArray();
    } catch(e) {
        return [];
    }
}

io.on('connection', async (socket) => {
    console.log('✅ مستخدم متصل');

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
            const allMessages = await getAllMessages();
            io.emit('admin-messages-update', allMessages);
        } catch(e) {
            console.log('خطأ:', e);
        }
    });

    socket.on('get-admin-messages', async () => {
        const allMessages = await getAllMessages();
        socket.emit('admin-messages-update', allMessages);
    });
    
    socket.on('delete-admin-message', async (messageId) => {
        try {
            await adminMessagesCollection.deleteOne({ id: messageId });
            const allMessages = await getAllMessages();
            io.emit('admin-messages-update', allMessages);
        } catch(e) {
            console.log('خطأ:', e);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
});
