const allRoles: Record<string, readonly string[]> = Object.freeze({
  user: Object.freeze([]),
  admin: Object.freeze(['users:retrieve', 'users:manage']),
})

export const roles = Object.freeze(Object.keys(allRoles))
export const roleRights = new Map(Object.entries(allRoles))
