import express from 'express'

import * as authHandler from './auth.handler'
import * as authSchema from './auth.schema'

import { login, validate } from '@/shared/middleware'

const router = express.Router()

router
  .post('/register', validate(authSchema.register), authHandler.register)
  .post('/login', validate(authSchema.login), login(), authHandler.login)
  .post('/logout', authHandler.logout)
  .post('/refresh', authHandler.refresh)

export default router
