const socket = io('http://localhost:3000')

let button = document.querySelector('.wrapper__button')
button.disabled = true

button.addEventListener('click', (e) => {
  e.preventDefault()
  socket.emit('activate')
})

socket.on('voiceStateChanged', (enabled) => {
  console.log(enabled)
  button.disabled = !enabled
})
