const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js')

const PORT = process.env.PORT || 5000;

const router = require('./router');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({name, room}, callback)=>{
        const {error, user} = addUser({ id: socket.id, name, room })

        if(error) return callback(error);
        //TODO почему мы отправляем сообщения до того, как подключили юзера к комнате?
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`});

        socket.join(user.room);

        callback();
    })

    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);
        //TODO почему выше мы использовали socket.to. а здесь используем io.to
        io.to(user.room).emit('message', { user: user.name, text: message })
        //TODO зачем вызывать постоянно этот колбэк?
        callback();
    })

    socket.on('disconnect', ()=>{
        console.log('User had left');
    })
})

app.use(router);

server.listen(PORT, ()=>console.log(`Server started on port: ${PORT}`))