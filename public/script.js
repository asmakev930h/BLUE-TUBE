const socket = io();

const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');
const userList = document.getElementById('users');

let username;

while (!username) {
    username = prompt('Please enter your username:');
}

socket.emit('new user', username);

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('chat message', messageInput.value);
        messageInput.value = '';
    }
});

socket.on('chat message', (data) => {
    const li = document.createElement('li');
    li.textContent = `${data.user}: ${data.message}`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user list', (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});
