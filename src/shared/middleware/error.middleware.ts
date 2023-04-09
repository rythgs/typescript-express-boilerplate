import { ErrorRequestHandler } from 'express'
import httpStatus from 'http-status'
import { QueryFailedError } from 'typeorm'

import { ApiError } from '@/shared/utils/ApiError'
import { errorHandler } from '@/shared/utils/errorHandler'

// @see https://expressjs.com/en/resources/middleware/body-parser.html#errors
const isBodyParserError = (error: any) => {
  const errorTypes = [
    'encoding.unsupported',
    'entity.parse.failed',
    'entity.verify.failed',
    'request.aborted',
    'entity.too.large',
    'request.size.invalid',
    'stream.encoding.set',
    'stream.not.readable',
    'parameters.too.many',
    'charset.unsupported',
  ]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  return 'type' in error && errorTypes.includes(error.type)
}

export const handleErrors: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
): void => {
  errorHandler(error as Error, res)
}

export const errorConverter: ErrorRequestHandler = (error, req, res, next) => {
  if (isBodyParserError(error)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    next(new ApiError('BodyParser Error', error.status, error.type))
    return
  }

  if (error instanceof QueryFailedError) {
    next(
      new ApiError(error.name, httpStatus.UNPROCESSABLE_ENTITY, error.message),
    )
  }
}
