const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.broadcast.emit('user-join', 'User joined the chat..');

    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message', msg);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', 'User left the chat..');
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server is running on port ${port} ...`));
