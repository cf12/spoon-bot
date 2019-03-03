const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = 3000

let users = 0

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

thing = false

io.on('connection', (socket) => {
  users++
  console.log(`[JOIN] > User joined: ${users} currently connected`)

  setInterval(() => {
    io.emit('voiceStateChange', thing)
    thing = !thing
  }, 1000)

  socket.on('disconnect', () => {
    users--
    console.log(`[LEAVE] > User left: ${users} connected remaining`)
  })
})

http.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})