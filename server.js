const express = require('express');
const path = require('path');

const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const User = require('./models/user');
// const router = require('./routes/chat');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// mongoose
//     .connect('mongodb+srv://admin:123@cluster0.8udwn.mongodb.net/chatApp', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//     })
//     .then(() => {
//         console.log('connected to db..');
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });

const users = new Map();
let username;
app.get('/chat', (req, res) => {
    console.log(req.query);
    if (!req.query.username || req.query === {}) {
        res.sendFile(path.join(__dirname, './public/index.html'));
    } else {
        username = req.query.username;
        res.sendFile(path.join(__dirname, './public/chat.html'));
    }
});

io.on('connection', (socket) => {
    addClient(socket.client.id, username);

    // let usersNames = [];
    // for (const iterator of users.values()) {
    //     usersNames.push(iterator);
    // }
    io.emit('allUsers', getCurrentUsers());

    socket.emit('chat-message', `Welcome ${username} to the chat!`, 'ChatBot');

    socket.broadcast.emit(
        'chat-message',
        `${username} joined the chat..`,
        'ChatBot'
    );

    socket.on('chat-message', (msg, clientName) => {
        clientName = getClient(socket.client.id);
        io.emit('chat-message', msg, clientName);
    });

    socket.on('disconnect', () => {
        const user = removeClient(socket.client.id);
        socket.broadcast.emit(
            'chat-message',
            `${user} left the chat..`,
            'ChatBot'
        );
        io.emit('allUsers', getCurrentUsers());
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server is running on port ${port} ...`));

function addClient(socketId, username) {
    users.set(socketId, username);
    // if (!users.has(username)) {
    //     users.set(username, new Set([socketId]));
    // } else {
    //     users.get(username).add(socketId);
    // }
}

function getClient(socketId) {
    let user;
    if (users.has(socketId)) {
        user = users.get(socketId);
        return user;
    }
}

function removeClient(socketId) {
    let user;
    if (users.has(socketId)) {
        user = users.get(socketId);
        users.delete(socketId);
        return user;
    }
}

function getCurrentUsers() {
    let usersNames = [];
    for (const iterator of users.values()) {
        usersNames.push(iterator);
    }
    return usersNames;
}
