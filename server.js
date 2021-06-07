const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const User = require('./utils/user');
const user = new User();

const msgInfo = require('./utils/message');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    let currentUsers = [];
    socket.on('join', ({ uname, room }) => {
        socket.join(room);

        user.addUser(socket.id, uname, room);

        socket.emit(
            'newMessage',
            msgInfo('Admin', `Welcome ${uname} to ${room}`)
        );

        socket.broadcast
            .to(room)
            .emit('newMessage', msgInfo('Admin', `${uname} joined the room`));

        currentUsers = user.getUsers(room);
        io.to(room).emit('usersOfRoom', currentUsers);
    });

    socket.on('createMessage', (msg) => {
        const { room } = user.getUser(socket.id)[0];
        const { from, body } = msg;
        io.to(room).emit('newMessage', msgInfo(from, body));
    });

    socket.on('disconnect', () => {
        const removedUser = user.removeUser(socket.id);
        if (!removedUser) return;
        currentUsers = user.getUsers(removedUser.room);

        socket.broadcast
            .to(removedUser?.room)
            .emit(
                'newMessage',
                msgInfo('Admin', `${removedUser.name} left the chat`)
            );
        io.to(removedUser.room).emit('usersOfRoom', currentUsers);
    });

    socket.on('checkUser', (data, cb) => {
        cb(user.checkUserExist(data));
    });
});

server.listen(process.env.PORT || 3000, () =>
    console.log(`Server is running ...`)
);
