import { type Response } from 'express'
import httpStatus from 'http-status'

import { ApiError } from './ApiError'

import { logger } from '@/shared/config/logger'
import { messages } from '@/shared/constants'

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
  // TODO: exitHandler(1)にしたい
  process.exit(1)
}

export const errorHandler = (error: Error | ApiError, res?: Response): void => {
  if (isTrustedError(error) && res != null) {
    handleTrustedError(error as ApiError, res)
  } else {
    handleUntrustedError(error, res)
  }
}
