import { type Role } from './role'

export type User = {
  name: string
  role: Role
}

export function createUser(userName: string): User {
  return {
    name: userName,
    role: 'observer',
  }
}
