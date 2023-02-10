import { type CookieOptions, type Response } from 'express'
import httpStatus from 'http-status'
import _ from 'lodash'

import { type LoginInput, type RegisterInput } from './auth.schema'
import * as authService from './auth.service'

import { tokenService } from '@/api/token'
import { userService, type User } from '@/api/users'
import { config } from '@/shared/config'
import { ApiErrorForbidden, asyncHandler } from '@/shared/utils'

const cookiePath = '/rest/v1/auth'

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
}

// Cookieの送信をHTTPSに限定（本番環境のみ）
if (config.env === 'production') {
  cookiesOptions.secure = true
}

const setTokenCookies = (
  res: Response,
  tokens: tokenService.AuthTokens,
): void => {
  res.cookie('access_token', tokens.access.token, {
    ...cookiesOptions,
    expires: tokens.access.expires,
    maxAge: config.jwt.accessTokenExpirationMinutes * 60,
  })
  res.cookie('refresh_token', tokens.refresh.token, {
    ...cookiesOptions,
    expires: tokens.refresh.expires,
    maxAge: config.jwt.refreshTokenExpirationDays * 60 * 60 * 24,
    // リフレッシュトークンを渡すパスを限定する
    path: cookiePath,
  })
}

export const register = asyncHandler<unknown, unknown, RegisterInput>(
  async (req, res) => {
    const user = await userService.createUser(
      _.omit(req.body, 'passwordConfirm'),
    )
    res.status(httpStatus.CREATED).send(user)
  },
)

export const login = asyncHandler<unknown, unknown, LoginInput>(
  async (req, res) => {
    // トークン生成
    const tokens = await tokenService.generateTokens(req.user as User)
    // Cookieに格納
    setTokenCookies(res, tokens)
    res.status(httpStatus.OK).send({ accessToken: tokens.access.token })
  },
)

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies.refresh_token)
  res.clearCookie('access_token', { maxAge: -1 })
  res.clearCookie('refresh_token', {
    maxAge: -1,
    path: cookiePath,
  })
  res.status(204).end()
})

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token
  if (refreshToken == null) {
    throw new ApiErrorForbidden()
  }
  const tokens = await authService.refreshAuth(refreshToken)
  setTokenCookies(res, tokens)
  res.status(httpStatus.OK).send({ accessToken: tokens.access.token })
})
