import { describe, expect, it } from 'bun:test'
import { roleManager } from './role-app'

describe('role use case', () => {
  it('should not assign a role if no user specified', () => {
    const error = roleManager().assign('')
    expect(error).toEqual({ message: 'A user needs a name!' })
  })

  it('should assign a role to a user', () => {
    const user = roleManager().assign('Bryan', 'navigator')
    expect(user).toEqual({ name: 'Bryan', role: 'navigator' })
  })
})
