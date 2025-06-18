import { Server } from 'socket.io'
import type {
  MobSession,
  User,
  TimerInfo,
  Participant,
  Timer,
  Role,
  StartTimerPayload,
  CreateUserPayload,
} from './types.js'
import { createTimer } from './timer.js'

const createUser = (name: string, role?: Role): User => {
  if (role) return { name, role }
  return { name, role: 'participant' }
}

const rotateRoles = (participants: Array<Participant>): Array<Participant> => {
  if (participants.length < 2) return participants

  const navigator = participants.find(
    (participant) => participant.role === 'navigator',
  )
  const driver = participants.find(
    (participant) => participant.role === 'driver',
  )
  const otherParticipants = participants.filter(
    (participant) => participant.role === 'participant',
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
    timer: {
      state: 'stopped',
      durationInSeconds: 0,
    },
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

    socket.on('create-user', (data: CreateUserPayload) => {
      console.log('Received user:', data)
      socket.emit('user-created', createUser(data.name, data.role))
    })

    socket.on('start-timer', (data: StartTimerPayload) => {
      currentTimer = createTimer(data.durationInSeconds, () => {
        currentSession.participants = rotateRoles(currentSession.participants)
        currentSession.timer = {
          state: 'stopped',
          durationInSeconds: 0,
        }
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
      if (currentTimer) {
        currentTimer.pause()
        currentSession.timer.state = 'paused'
        io.emit('timer-paused', currentSession.timer)
      }
    })

    socket.on('reset-timer', () => {
      if (currentTimer) {
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
