let socket = io();

let messageInput = document.getElementById('m');
let ulList = document.getElementById('messages');
let btn = document.getElementById('btn');
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true });

btn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat-message', messageInput.value);

    // appendLI(messageInput.value);
    ulList.scrollTop = ulList.scrollHeight;
    messageInput.value = '';
    messageInput.focus();
});

socket.on('chat-message', (msg, clientName) => {
    // console.log(clientName);
    appendLI(msg, clientName);
});
socket.on('allUsers', (users) => {
    document.getElementById('users').innerHTML = '';
    for (let key of users) {
        appendLIOnlineUsers(key);
    }
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
