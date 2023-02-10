import express from 'express'

import * as userHandler from './user.handler'
import * as userSchema from './user.schema'

import { auth, validate } from '@/shared/middleware'

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
