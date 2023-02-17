import express from 'express'

import * as userHandler from './user.handler'
import * as userSchema from './user.schema'

import { auth } from '@/shared/middleware/auth.middleware'
import { validate } from '@/shared/middleware/validate.middleware'

const router = express.Router()

router.get('/me', auth(), userHandler.me)

router
  .route('/')
  .get(auth('user:retrieve'), userHandler.list)
  .post(auth('users:manage'), validate(userSchema.create), userHandler.create)

router
  .route('/:userId')
  .get(auth('users:retrieve'), validate(userSchema.getOne), userHandler.getOne)
  .patch(auth('users:manage'), validate(userSchema.update), userHandler.update)
  .delete(auth('users:manage'), validate(userSchema.remove), userHandler.remove)

export default router
