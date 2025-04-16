import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
})

socket.on('connect', () => {
  console.log('Connected to server!')
  console.log(`Socket ID: ${socket.id}`)

  // Send a test message
  socket.emit('test-message', { text: 'Hello from test client!' })

  // Create a new attendee
  socket.emit('create-user', { name: 'Bryan' })
  socket.emit('create-user', { name: 'Souami', role: 'driver' })
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// Listen for any custom events from the server
socket.onAny((eventName, ...args) => {
  console.log(`Received event "${eventName}":`, args)
})

// Keep the connection alive
process.on('SIGINT', () => {
  console.log('Closing connection...')
  socket.disconnect()
  process.exit()
})

console.log('Attempting to connect to WebSocket server...')
