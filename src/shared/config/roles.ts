export const roles = {
  user: 'user',
  admin: 'admin',
} as const

export type Roles = (typeof roles)[keyof typeof roles]

const allRoles: Record<Roles, readonly string[]> = Object.freeze({
  user: Object.freeze([]),
  admin: Object.freeze(['users:retrieve', 'users:manage']),
})

export const roleRights = new Map(Object.entries(allRoles))
