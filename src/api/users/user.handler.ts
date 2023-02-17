import { Request, Response } from 'express'
import httpStatus from 'http-status'

import {
  type CreateInput,
  type GetOneInput,
  type RemoveInput,
  type UpdateInput,
  type UpdateSchama,
} from './user.schema'
import * as userService from './user.service'

import { ApiErrorNotFound } from '@/shared/utils/ApiError'
import { asyncHandler } from '@/shared/utils/asyncHandler'

export const create = asyncHandler<unknown, unknown, CreateInput>(
  async (req, res) => {
    const user = await userService.createUser(req.body)
    res.status(httpStatus.CREATED).send(user)
  },
)

export const getOne = asyncHandler<GetOneInput>(async (req, res) => {
  const user = await userService.getUserById(req.params.userId)
  if (user == null) {
    throw new ApiErrorNotFound()
  }
  res.send(user)
})

export const update = asyncHandler<
  UpdateSchama['params'],
  unknown,
  UpdateInput
>(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body)
  res.send(user)
})

export const remove = asyncHandler<RemoveInput>(async (req, res) => {
  await userService.deleteUserById(req.params.userId)
  res.status(httpStatus.NO_CONTENT).send()
})

export const list = asyncHandler(async (req, res) => {
  const users = await userService.getUsers()
  res.send(users)
})

export const me = (req: Request, res: Response) => {
  res.send(req.user)
}
