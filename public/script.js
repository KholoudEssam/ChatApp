let socket = io();

let messageInput = document.getElementById('m');
let ulList = document.getElementById('messages');
let btn = document.getElementById('btn');
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const uname = 'testUser' + Math.random();

socket.on('connect', () => {
    console.log('Connected to Server');
    appendLIOnlineUsers(uname);
});

btn.addEventListener('click', (e) => {
    e.preventDefault();

    socket.emit('createMessage', {
        from: uname,
        body: messageInput.value,
    });
    // appendLI(messageInput.value);

    messageInput.value = '';
    messageInput.focus();
});

socket.on('newMessage', (msg) => {
    console.log(`From ${msg.from}: ${msg.body} at ${msg.createdAt}`);

    appendLI(msg.body, msg.from);
});

function appendLI(msg, clientName) {
    let node = document.createElement('LI');
    let textnode = document.createTextNode(`${clientName}: ${msg}`);
    node.appendChild(textnode);
    ulList.appendChild(node);
}
function appendLIOnlineUsers(clientName) {
    let node = document.createElement('LI');
    let textnode = document.createTextNode(`${clientName}`);
    node.appendChild(textnode);
    document.getElementById('users').appendChild(node);
}
