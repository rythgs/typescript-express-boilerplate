import { type User as AppUser } from '@/api/users'

declare namespace Express {
  export type User = AppUser
}
