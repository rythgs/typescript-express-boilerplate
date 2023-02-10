import { type NextFunction, type Request, type Response } from 'express'
import httpStatus from 'http-status'

import { config, logger } from '@/shared/config'
import { ApiError } from '@/shared/utils'

export interface ErrorResponse {
  code: number
  message: string
  errors?: any[]
  stack?: string
}

const convertToApiError = (error: any): ApiError => {
  if (!(error instanceof ApiError)) {
    const statusCode = error.code ?? httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message ?? httpStatus[statusCode]

    return new ApiError(statusCode, message, [error.stack])
  }

  return error
}

export const handleErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { statusCode, stack, message, errors } = convertToApiError(error)
  const response: ErrorResponse = {
    code: statusCode,
    message,
    errors,
    ...(config.env === 'development' && { stack }),
  }

  if (config.env === 'development') {
    logger.error(JSON.stringify(response))
  }

  res.status(statusCode).json(response).end()
}
