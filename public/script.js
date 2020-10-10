let socket = io();

let messageInput = document.getElementById('m');
let ulList = document.getElementById('messages');
let btn = document.getElementById('btn');

btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat-message', messageInput.value);

    appendLI(messageInput.value);
    ulList.scrollTop = ulList.scrollHeight;
    messageInput.value = '';
    messageInput.focus();
});

socket.on('chat-message', (msg) => {
    appendLI(msg);
});

socket.on('current-users', (users) => {
    users.forEach((user) => {
        let node = document.createElement('LI');
        let textnode = document.createTextNode(`${user.username}`);
        node.appendChild(textnode);
        document.getElementById('users').appendChild(node);
    });
});

function appendLI(data) {
    let node = document.createElement('LI');
    let textnode = document.createTextNode(`${data}`);
    node.appendChild(textnode);
    ulList.appendChild(node);
}
