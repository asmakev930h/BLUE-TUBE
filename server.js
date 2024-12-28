const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = new Set();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new user', (username) => {
    users.add(username);
    socket.username = username;
    io.emit('user list', Array.from(users));
    io.emit('chat message', { user: 'System', message: `${username} joined the chat` });
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: socket.username, message: msg });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      users.delete(socket.username);
      io.emit('user list', Array.from(users));
      io.emit('chat message', { user: 'System', message: `${socket.username} left the chat` });
    }
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

