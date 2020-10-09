let socket = io();

let messageInput = document.getElementById('m');
let btn = document.getElementById('btn');

let name = prompt('Enter you nickname: ');

btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat-message', messageInput.value);

    appendLI(name, messageInput.value);
    messageInput.value = '';
});

socket.on('chat-message', (msg) => {
    appendLI(name, msg);
});

socket.on('user-join', (msg) => {
    appendLI(name, msg);
});

socket.on('user-left', (msg) => {
    appendLI(name, msg);
});

function appendLI(name, data) {
    let node = document.createElement('LI');
    let textnode = document.createTextNode(`${name}: ${data}`);
    node.appendChild(textnode);
    document.getElementById('messages').appendChild(node);
}
