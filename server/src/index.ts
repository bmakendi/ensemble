import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer()
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('someone just logged in')
  socket.on('logout', () => {
    console.log('that someone bailed out')
  })
})

server.listen(8000, () => {
  console.log('server running on port 8000')
})
