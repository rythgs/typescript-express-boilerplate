/* eslint-disable max-classes-per-file */
import httpStatus from 'http-status'

import { messages } from '@/shared/constants'

export class ApiError extends Error {
  constructor(
    public readonly name: string = 'Internal Server Error',
    public readonly statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
    public readonly description: string = messages.EXCEPTION_INTERNAL_SERVER_ERROR,
    public readonly isOperational: boolean = true,
    public errors: unknown[] = [],
  ) {
    super(description)
    Error.captureStackTrace(this, this.constructor)
  }
}

// 400 Bad Request
export class ApiErrorBadRequest extends ApiError {
  constructor(description?: string, errors?: unknown[]) {
    super(
      'Bad Request',
      httpStatus.BAD_REQUEST,
      description ?? messages.EXCEPTION_BAD_REQUEST,
      true,
      errors,
    )
  }
}

// 401 Unauthorized
export class ApiErrorUnauthorized extends ApiError {
  constructor(description?: string, errors?: unknown[]) {
    super(
      'Unauthorized',
      httpStatus.UNAUTHORIZED,
      description ?? messages.EXCEPTION_NEED_LOGIN,
      true,
      errors,
    )
  }
}

// 403 Forbidden
export class ApiErrorForbidden extends ApiError {
  constructor(description?: string, errors?: unknown[]) {
    super(
      'Forbidden',
      httpStatus.FORBIDDEN,
      description ?? messages.EXCEPTION_FORBIDDEN,
      true,
      errors,
    )
  }
}

// 404 Not Found
export class ApiErrorNotFound extends ApiError {
  constructor(description?: string, errors?: unknown[]) {
    super(
      'Not Found',
      httpStatus.NOT_FOUND,
      description ?? messages.EXCEPTION_NOT_FOUND,
      true,
      errors,
    )
  }
}
