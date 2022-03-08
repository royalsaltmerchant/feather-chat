// globals
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// get username and room from URL
const {username, room} = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

// socket
const socket = io()

// join chatroom
socket.emit('joinRoom', {username, room})

// get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

// message from server
socket.on('message', message => {
    outputMessage(message)
    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// form message submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    // emit message to server
    socket.emit('chatMessage', msg)

    // clear input 
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// output message to dom
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = /*html*/ `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `
    chatMessages.appendChild(div)
}

// add room name to dom
function outputRoomName(room) {
    roomName.innerText = room
}

// add users to dom
function outputUsers(users) {
    userList.innerHTML = /*html*/ `
        ${users.map(user => /*html*/ `<li>${user.username}</li>`).join('')}
    `
}