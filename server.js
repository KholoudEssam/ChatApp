const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const msgInfo = require('./utils/message');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/chat.html'));
});

// app.get('/chat', (req, res) => {
//     console.log(req.query);
//     if (!req.query.username || req.query === {}) {
//         res.sendFile(path.join(__dirname, './public/index.html'));
//     } else {
//         username = req.query.username;
//         res.sendFile(path.join(__dirname, './public/chat.html'));
//     }
// });

io.on('connection', (socket) => {
    console.log('Client Connected');

    socket.emit('newMessage', msgInfo('Admin', 'Welcome to the chat!'));

    socket.broadcast.emit(
        'newMessage',
        msgInfo('Admin', 'NewUser just joined the chat!')
    );

    socket.on('createMessage', (msg) => {
        const { from, body } = msg;
        console.log(`${from} : ${body}`);

        io.emit('newMessage', msgInfo(from, body));
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

server.listen(process.env.PORT || 3000, () =>
    console.log(`Server is running ...`)
);
