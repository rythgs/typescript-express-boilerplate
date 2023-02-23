import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { ApiErrorBadRequest } from '../utils/ApiError'

import { validate } from './validate.middleware'

describe('Validate Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {}
  })

  test('params:OK', () => {
    mockRequest = {
      params: {
        id: 'hoge',
      },
    }
    validate(
      z.object({
        params: z.object({
          id: z.string(),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith()
  })

  test('params:NG', () => {
    mockRequest = {
      params: {
        id: '123456',
      },
    }
    validate(
      z.object({
        params: z.object({
          id: z.string().max(5),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith(new ApiErrorBadRequest())
  })

  test('query:OK', () => {
    mockRequest = {
      query: {
        id: '12345',
      },
    }
    validate(
      z.object({
        query: z.object({
          id: z.string().max(5),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith()
  })

  test('query:NG', () => {
    mockRequest = {
      query: {
        id: '123456',
      },
    }
    validate(
      z.object({
        query: z.object({
          id: z.string().max(5),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith(new ApiErrorBadRequest())
  })

  test('query:NG', () => {
    mockRequest = {
      query: {
        id: '123456',
      },
    }
    validate(
      z.object({
        query: z.object({
          id: z.string().max(5),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith(new ApiErrorBadRequest())
  })

  test('body:OK', () => {
    mockRequest = {
      body: {
        name: '12345',
      },
    }
    validate(
      z.object({
        body: z.object({
          name: z.string().max(5),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith()
  })

  test('body:NG', () => {
    mockRequest = {
      body: {
        name: '123456',
      },
    }
    validate(
      z.object({
        body: z.object({
          name: z.string().max(5),
        }),
      }),
    )(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toBeCalledWith(new ApiErrorBadRequest())
  })
})
