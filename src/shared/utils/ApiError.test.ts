import httpStatus from 'http-status'

import {
  ApiError,
  ApiErrorBadRequest,
  ApiErrorForbidden,
  ApiErrorNotFound,
  ApiErrorUnauthorized,
} from '@/shared/utils/ApiError'

describe('Exception', () => {
  describe('ApiError', () => {
    test('ステータスコードが500であることの確認', () => {
      const error = new ApiError('Internal Server Error')
      expect(error.name).toEqual('Internal Server Error')
      expect(error.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
    })

    test('任意のステータスコードを指定できることの確認', () => {
      const error = new ApiError('a', httpStatus.CONFLICT)
      expect(error.statusCode).toEqual(httpStatus.CONFLICT)
    })

    test('任意のメッセージを指定できることの確認', () => {
      const message = 'hogehoge'
      const error = new ApiError('a', undefined, message)
      expect(error.message).toEqual(message)
    })

    test('任意の追加情報を指定できることの確認', () => {
      const errors = [{ test: 'aaaa' }]
      const error = new ApiError('a', undefined, undefined, true, errors)
      expect(error.errors).toEqual(expect.arrayContaining(errors))
    })
  })

  describe('ApiErrorBadRequest', () => {
    test('ステータスコードが400であることの確認', () => {
      const error = new ApiErrorBadRequest()
      expect(error.statusCode).toEqual(httpStatus.BAD_REQUEST)
    })
  })

  describe('ApiErrorUnauthorized', () => {
    test('ステータスコードが401であることの確認', () => {
      const error = new ApiErrorUnauthorized()
      expect(error.statusCode).toEqual(httpStatus.UNAUTHORIZED)
    })
  })

  describe('ApiErrorForbidden', () => {
    test('ステータスコードが403であることの確認', () => {
      const error = new ApiErrorForbidden()
      expect(error.statusCode).toEqual(httpStatus.FORBIDDEN)
    })
  })

  describe('ApiErrorNotFound', () => {
    test('ステータスコードが404であることの確認', () => {
      const error = new ApiErrorNotFound()
      expect(error.statusCode).toEqual(httpStatus.NOT_FOUND)
    })
  })
})

export default {}
