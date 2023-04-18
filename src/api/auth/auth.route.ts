import express from 'express'

import * as authHandler from './auth.handler'
import * as authSchema from './auth.schema'

import { login } from '@/shared/middleware/auth.middleware'
import { validate } from '@/shared/middleware/validate.middleware'

const authRouter = express.Router()

authRouter
  .post('/register', validate(authSchema.register), authHandler.register)
  .post('/login', validate(authSchema.login), login(), authHandler.login)
  .post('/logout', authHandler.logout)
  .post('/refresh', authHandler.refresh)

export { authRouter }
