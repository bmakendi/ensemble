import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: { origin: '*' },
  transports: ['websocket'],
})

console.log('Server running on port 3000!')

io.on('connection', (socket) => {
  console.log('connected')
})
