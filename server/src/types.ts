export type Role = 'navigator' | 'driver' | 'participant'

export type Participant = {
  name: string
  role: Role
}

export type MobSession = {
  participants: Array<Participant>
}

export type User = {
  name: string
  role: Role
}