import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Server } from 'socket.io'
import { io as Client, Socket as ClientSocket } from 'socket.io-client'
import type { TimerInfo, MobSession } from './types.js'
import { createMobServer } from './server.js'

describe('Server Timer Integration', () => {
  let server: Server
  let clientSocket: ClientSocket

  beforeEach(async () => {
    server = createMobServer(3001)
    clientSocket = Client('http://localhost:3001', {
      transports: ['websocket'],
    })
    
    await new Promise<void>((resolve) => {
      clientSocket.on('connect', () => resolve())
    })
  })

  afterEach(() => {
    server.close()
    clientSocket.close()
  })

  it('should start timer and broadcast timer-started event', async () => {
    const timerStartedPromise = new Promise<TimerInfo>((resolve) => {
      clientSocket.on('timer-started', resolve)
    })

    clientSocket.emit('start-timer', { durationInSeconds: 300 })

    const timerInfo = await timerStartedPromise
    expect(timerInfo.state).toBe('running')
    expect(timerInfo.durationInSeconds).toBe(300)
    expect(timerInfo.startedAtTimestamp).toBeTypeOf('number')
  })

  it('should pause timer and broadcast timer-paused event', async () => {
    const timerPausedPromise = new Promise<TimerInfo>((resolve) => {
      clientSocket.on('timer-paused', resolve)
    })

    clientSocket.emit('start-timer', { durationInSeconds: 300 })
    clientSocket.emit('pause-timer')

    const timerInfo = await timerPausedPromise
    expect(timerInfo.state).toBe('paused')
  })

  it('should reset timer and broadcast timer-reset event', async () => {
    const timerResetPromise = new Promise<TimerInfo>((resolve) => {
      clientSocket.on('timer-reset', resolve)
    })

    clientSocket.emit('start-timer', { durationInSeconds: 300 })
    clientSocket.emit('reset-timer')

    const timerInfo = await timerResetPromise
    expect(timerInfo.state).toBe('stopped')
  })

  it('should broadcast timer events to all connected clients', async () => {
    const secondClient = Client('http://localhost:3001', {
      transports: ['websocket'],
    })

    await new Promise<void>((resolve) => {
      secondClient.on('connect', () => resolve())
    })

    const firstClientPromise = new Promise<TimerInfo>((resolve) => {
      clientSocket.on('timer-started', resolve)
    })

    const secondClientPromise = new Promise<TimerInfo>((resolve) => {
      secondClient.on('timer-started', resolve)
    })

    clientSocket.emit('start-timer', { durationInSeconds: 180 })

    const [firstClientTimer, secondClientTimer] = await Promise.all([
      firstClientPromise,
      secondClientPromise,
    ])

    expect(firstClientTimer.state).toBe('running')
    expect(secondClientTimer.state).toBe('running')
    expect(firstClientTimer.durationInSeconds).toBe(180)
    expect(secondClientTimer.durationInSeconds).toBe(180)

    secondClient.close()
  })

  it('should rotate roles when timer completes', async () => {
    const rolesRotatedPromise = new Promise<MobSession>((resolve) => {
      clientSocket.on('roles-rotated', resolve)
    })

    clientSocket.emit('start-timer', { durationInSeconds: 1 })

    const updatedSession = await rolesRotatedPromise

    expect(updatedSession.participants).toEqual([
      { name: 'Bob', role: 'participant' },
      { name: 'John', role: 'navigator' },
    ])
  }, 10000)
})