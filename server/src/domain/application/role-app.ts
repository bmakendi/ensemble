import type { Role } from '../models/role'
import type { User } from '../models/user'

type RoleError = {
  message: string
}

interface RoleManager {
  assign: (username: string, role?: Role) => User | RoleError
}

export const roleManager = (): RoleManager => {
  return {
    assign: (username, role = 'observer') => {
      if (username === '') return { message: 'A user needs a name!' }
      return { name: username, role }
    },
  }
}
