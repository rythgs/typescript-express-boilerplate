import { type Response } from 'express'
import httpStatus from 'http-status'

import { logger } from '../config'
import { messages } from '../constants'

import { ApiError } from './ApiError'
import { exitHandler } from './exitHandler'

const isTrustedError = (error: Error): boolean =>
  error instanceof ApiError ? error.isOperational : false

const handleTrustedError = (error: ApiError, res: Response): void => {
  res
    .status(error.statusCode)
    .send({ message: error.description, errors: error.errors })
}

const handleUntrustedError = (
  error: Error | ApiError,
  res?: Response,
): void => {
  if (res != null) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: messages.EXCEPTION_INTERNAL_SERVER_ERROR })
  }

  logger.error('Encountered an untrusted error.', error)
  void exitHandler(1)
}

export const errorHandler = (error: Error | ApiError, res?: Response): void => {
  if (isTrustedError(error) && res != null) {
    handleTrustedError(error as ApiError, res)
  } else {
    handleUntrustedError(error, res)
  }
}
