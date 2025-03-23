import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: { origin: '*' },
  transports: ['websocket'],
})

console.log('Server running on port 3000!')

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Respond to test messages
  socket.on('test-message', (data: unknown) => {
    console.log('Received test message:', data)
    socket.emit('test-response', {
      text: 'Server received your message!',
      originalData: data,
    })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})
