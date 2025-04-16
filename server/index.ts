import { Server } from 'socket.io'
import { roleManager } from 'src/domain/application/role-app'
import type { User } from 'src/domain/models/user'

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

  socket.on('create-user', (data: User) => {
    console.log('Received user:', data)
    socket.emit('user-created', roleManager().assign(data.name, data.role))
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})
