import { NextFunction, Request, Response } from 'express'

import { asyncHandler } from './asyncHandler'

const errorFunction = async () =>
  new Promise(() => {
    setTimeout(() => {
      throw new Error('NG')
    }, 1000)
  })

describe('asyncHandler', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {}
    nextFunction = jest.fn()
  })

  test('例外をキャッチできること', () => {
    expect(() => {
      asyncHandler(async () => {
        await errorFunction()
        expect(nextFunction).toBeCalledWith(new Error('NG'))
      })(mockRequest as Request, mockResponse as Response, nextFunction)
    }).not.toThrowError()
  })
})
