let socket = io();

let messageInput = document.getElementById('message');
let ulList = document.getElementById('messages');
let btn = document.getElementById('btn');

const uname = 'testUser' + Math.ceil(Math.random() * 10);

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

    messageInput.value = '';
    messageInput.focus();
});

socket.on('newMessage', (msg) => {
    const { body, from, createdAt } = msg;
    console.log(`From ${from}: ${body} at ${createdAt}`);

    appendMessage(body, from, createdAt);
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
function appendLIOnlineUsers(clientName) {
    let node = document.createElement('LI');
    let textnode = document.createTextNode(`${clientName}`);
    node.appendChild(textnode);
    document.getElementById('users').appendChild(node);
}
