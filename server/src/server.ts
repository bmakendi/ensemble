import { Server } from 'socket.io'
import type { MobSession, User, TimerInfo, Participant, Timer } from './types.js'
import { createTimer } from './timer.js'

const createUser = ({ name, role }: { name: string; role?: string }): User => {
  if (role) return { name, role: role as User['role'] }
  return { name, role: 'participant' }
}

const rotateRoles = (participants: Array<Participant>): Array<Participant> => {
  if (participants.length < 2) return participants

  const navigator = participants.find((p) => p.role === 'navigator')
  const driver = participants.find((p) => p.role === 'driver')
  const otherParticipants = participants.filter(
    (p) => p.role === 'participant'
  )

  const newParticipants: Array<Participant> = []

  if (navigator) {
    newParticipants.push({ ...navigator, role: 'participant' })
  }

  if (driver) {
    newParticipants.push({ ...driver, role: 'navigator' })
  }

  if (otherParticipants.length > 0) {
    newParticipants.push({ ...otherParticipants[0], role: 'driver' })
    newParticipants.push(...otherParticipants.slice(1))
  }

  return newParticipants
}

export const createMobServer = (port: number): Server => {
  const io = new Server(port, {
    cors: { origin: '*' },
    transports: ['websocket'],
  })

  const currentSession: MobSession = {
    participants: [
      {
        name: 'Bob',
        role: 'navigator',
      },
      {
        name: 'John',
        role: 'driver',
      },
    ],
  }

  let currentTimer: Timer | null = null

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.emit('session-state', currentSession)

    socket.on('test-message', (data: unknown) => {
      console.log('Received test message:', data)
      socket.emit('test-response', {
        text: 'Server received your message!',
        originalData: data,
      })
    })

    socket.on('create-user', (data: User) => {
      console.log('Received user:', data)
      socket.emit('user-created', createUser(data))
    })

    socket.on('start-timer', (data: { durationInSeconds: number }) => {
      currentTimer = createTimer(data.durationInSeconds, () => {
        currentSession.participants = rotateRoles(currentSession.participants)
        currentSession.timer = undefined
        io.emit('roles-rotated', currentSession)
      })
      
      currentTimer.start()
      
      const timerInfo: TimerInfo = {
        state: 'running',
        durationInSeconds: data.durationInSeconds,
        startedAtTimestamp: Date.now(),
      }
      currentSession.timer = timerInfo
      io.emit('timer-started', timerInfo)
    })

    socket.on('pause-timer', () => {
      if (currentTimer && currentSession.timer) {
        currentTimer.pause()
        currentSession.timer.state = 'paused'
        io.emit('timer-paused', currentSession.timer)
      }
    })

    socket.on('reset-timer', () => {
      if (currentTimer && currentSession.timer) {
        currentTimer.reset()
        currentSession.timer.state = 'stopped'
        currentSession.timer.startedAtTimestamp = undefined
        io.emit('timer-reset', currentSession.timer)
      }
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}