import { addDays, addMinutes } from 'date-fns'
import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken'

import { Token, TokenType } from './token.entity'

import { type User } from '@/api/users'
import { config } from '@/shared/config'
import { dataSource } from '@/shared/database/data-source'
import { ApiErrorForbidden } from '@/shared/utils'

const tokenRepository = dataSource.getRepository(Token)

export interface TokenPayload {
  sub: string
  iat: number
  exp: number
  type: TokenType
}

export interface AuthTokens {
  access: {
    token: string
    expires: Date
  }
  refresh: {
    token: string
    expires: Date
  }
}

export const generateToken = (
  userId: string,
  expires: Date,
  key: string,
  type: TokenType = TokenType.Access,
  options?: SignOptions,
  passphrase = config.jwt.passphrase,
): string => {
  const payload: TokenPayload = {
    sub: userId,
    iat: new Date().getTime(),
    exp: expires.getTime(),
    type,
  }
  const privateKey = {
    key: Buffer.from(key, 'base64'),
    passphrase,
  }
  const signOptions: SignOptions = {
    ...(options != null && options),
    algorithm: 'RS256',
  }
  return jwt.sign(payload, privateKey, signOptions)
}

export const generateAuthTokens = async (user: User): Promise<AuthTokens> => {
  const now = Date.now()
  const {
    accessTokenPrivateKey,
    accessTokenExpirationMinutes,
    refreshTokenPrivateKey,
    refreshTokenExpirationDays,
  } = config.jwt

  const accessTokenExpires = addMinutes(now, accessTokenExpirationMinutes)
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    accessTokenPrivateKey,
    TokenType.Access,
  )
  const refreshTokenExpires = addDays(now, refreshTokenExpirationDays)
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    refreshTokenPrivateKey,
    TokenType.Refresh,
  )

  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.Refresh)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  }
}

export const verifyToken = async (
  token: string,
  publicKeyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey',
  type: TokenType,
  options?: VerifyOptions,
): Promise<Token> => {
  // トークン検証
  const publicKey = Buffer.from(config.jwt[publicKeyName], 'base64')
  const payload = jwt.verify(token, publicKey, {
    ...(options != null && options),
    algorithms: ['RS256'],
  }) as TokenPayload

  // トークンテーブルに存在するか確認
  const entity = await tokenRepository.findOne({
    where: {
      token,
      type,
      userId: payload.sub,
      blacklisted: false,
    },
  })

  if (entity == null) {
    throw new ApiErrorForbidden()
  }

  return entity
}

export const saveToken = async (
  token: string,
  userId: string,
  expires: Date,
  type: TokenType,
  blacklisted = false,
): Promise<Token> =>
  await tokenRepository.save({
    token,
    userId,
    expires,
    type,
    blacklisted,
  })

export const destroyRefreshToken = async (id: string): Promise<void> => {
  await tokenRepository.delete(id)
}

export const getActiveRefreshToken = async (
  refreshToken: string,
): Promise<Token | null> => {
  return await tokenRepository.findOne({
    where: { token: refreshToken, type: TokenType.Refresh, blacklisted: false },
  })
}
