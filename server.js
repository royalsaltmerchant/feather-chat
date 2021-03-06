const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

// init
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// static
app.use(express.static(path.join(__dirname, 'dist')))

// globals
const botName = 'Feather-Bot'

// socket
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        // welcome
        socket.emit('message', formatMessage(botName, 'Welcome to Feather-Chat'))
        
        // broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} has joined the room`))

        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the room`))

            // send users and room info
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
        }

    })
})




const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))