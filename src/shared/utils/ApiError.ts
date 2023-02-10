import httpStatus from 'http-status'

import { messages } from '@/shared/constants'

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    public readonly message: string = messages.EXCEPTION_INTERNAL_SERVER_ERROR,
    public errors: any[] = [],
  ) {
    super(message)
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

// 400 Bad Request
export class ApiErrorBadRequest extends ApiError {
  constructor(message?: string, errors?: any[]) {
    super(
      httpStatus.BAD_REQUEST,
      message ?? messages.EXCEPTION_BAD_REQUEST,
      errors,
    )
  }
}

// 401 Unauthorized
export class ApiErrorUnauthorized extends ApiError {
  constructor(message?: string, errors?: any[]) {
    super(
      httpStatus.UNAUTHORIZED,
      message ?? messages.EXCEPTION_NEED_LOGIN,
      errors,
    )
  }
}

// 403 Forbidden
export class ApiErrorForbidden extends ApiError {
  constructor(message?: string, errors?: any[]) {
    super(httpStatus.FORBIDDEN, message ?? messages.EXCEPTION_FORBIDDEN, errors)
  }
}

// 404 Not Found
export class ApiErrorNotFound extends ApiError {
  constructor(message?: string, errors?: any[]) {
    super(httpStatus.NOT_FOUND, message ?? messages.EXCEPTION_NOT_FOUND, errors)
  }
}
