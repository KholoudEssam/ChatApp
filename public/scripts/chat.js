let socket = io();

let messageInput = document.getElementById('message');
let ulList = document.getElementById('messages');
let onlineUsers = document.getElementById('users');
let btn = document.getElementById('btn');
let uname = '';
let room = '';

socket.on('connect', () => {
    console.log('Connected to Server');
    const data = extractParams();
    if (!(isRealString(data.name) || isRealString(data.room))) {
        alert('name and room name are required');
        window.location.href = '/';
        return;
    }
    uname = capitalizeFirstLetter(data.name);
    room = capitalizeFirstLetter(data.room);

    socket.emit('join', { uname, room });
});

btn.addEventListener('click', (e) => {
    e.preventDefault();

    socket.emit('createMessage', {
        from: uname,
        body: messageInput.value,
    });

    messageInput.value = '';
    messageInput.focus();
});

socket.on('newMessage', (msg) => {
    const { body, from, createdAt } = msg;

    appendMessage(body, from, createdAt);

    scrollToBottom();
});

socket.on('usersOfRoom', (users) => {
    onlineUsers.innerHTML = '';
    users.forEach((user) => {
        appendOnlineUsers(user);
    });
});

function appendMessage(body, from, createdAt) {
    const msgLI = document.createElement('LI');
    msgLI.classList.add('message');
    msgLI.innerHTML = `
        <div class='message__title'>
            <h4>${from}</h4>
            <span>${createdAt}</span>
        </div>
        <div class='message__body'>
            <p>${body}</p>
        </div>
    `;
    ulList.appendChild(msgLI);
}
function appendOnlineUsers(user) {
    let node = document.createElement('LI');
    let textnode = document.createTextNode(`${user}`);
    node.appendChild(textnode);
    onlineUsers.appendChild(node);
}

// Helper functions
function scrollToBottom() {
    const { clientHeight, scrollTop, scrollHeight } = ulList;
    const newMessage = ulList.lastElementChild;
    const newMsgHeight = newMessage.clientHeight;
    const lastMsgHeight = newMessage.previousElementSibling?.clientHeight;

    const heightCalc = clientHeight + scrollTop + newMsgHeight + lastMsgHeight;
    if (heightCalc >= scrollHeight) {
        ulList.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }
}
function extractParams() {
    const queryString = {};

    location.search.replace(
        new RegExp('([^?=&]+)(=([^&#]*))?', 'g'),
        function (val1, val2, val3, val4) {
            queryString[val2] = decodeURIComponent(
                val3.replace(/\+/g, '%20').replace('=', '')
            );
        }
    );
    return queryString;
}
function capitalizeFirstLetter(str) {
    return str && str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}
function isRealString(str) {
    return typeof str === 'string' && str.trim().length > 0;
}
