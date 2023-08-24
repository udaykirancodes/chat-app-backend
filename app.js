const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const http = require('http');
const server = http.Server(app);
const bodyParser = require('body-parser')
const { Server } = require("socket.io");
const io = new Server(server);
// Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const routes = require('./routes/index');
app.use('/', routes);

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public')));
module.exports = { app, server }

let users = [];


const addUser = (userId, socketId) => {
    if (!userId || userId === "") return;
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

// setInterval(() => {
//     console.log('Online :- ' + JSON.stringify(users.length));
// }, 10000);



io.on('connection', (socket) => {
    console.log('user connected!')
    //take userId and socketId from  user
    socket.on("addUser", (userId) => {
        console.log('User id :- ' + userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });
    //send and get message
    socket.on("sendMessage", (message) => {
        console.log('Message Received ' + JSON.stringify(message.message));
        const user = getUser(message.receiverId);
        if (!user) return;
        console.log('socket sent for msg');
        io.to(user.socketId).emit("getMessage", message);
    });
    socket.on("typing", ({ receiverId }) => {
        const user = getUser(receiverId);
        if (user == null) {
            console.log('user not found')
        }
        if (user == null || user?.length == 0) return;
        // io.emit('take', data);
        io.to(user.socketId).emit("takeTyping", 'Typing');
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
})
