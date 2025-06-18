export type Role = 'navigator' | 'driver' | 'participant'

export type Participant = {
  name: string
  role: Role
}

export type TimerInfo = {
  state: TimerState
  durationInSeconds: number
  startedAtTimestamp?: number
}

export type MobSession = {
  participants: Array<Participant>
  timer: TimerInfo
}

export type User = {
  name: string
  role: Role
}

export type TimerState = 'stopped' | 'running' | 'paused'

export type Timer = {
  start: () => void
  pause: () => void
  reset: () => void
  getCurrentTime: () => number
  getState: () => TimerState
}

export type StartTimerPayload = {
  durationInSeconds: number
}

export type CreateUserPayload = {
  name: string
  role?: Role
}
