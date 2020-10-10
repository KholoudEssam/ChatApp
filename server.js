const express = require('express');
const path = require('path');

const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const router = require('./routes/chat');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

mongoose
    .connect('mongodb+srv://admin:123@cluster0.8udwn.mongodb.net/chatApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('connected to db..');
    })
    .catch((err) => {
        console.log(err.message);
    });

io.on('connection', async (socket) => {
    const users = await User.find();

    socket.broadcast.emit('current-users', users);

    socket.broadcast.emit('chat-message', 'User joined the chat..');

    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message', msg);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('chat-message', 'User left the chat..');
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server is running on port ${port} ...`));
