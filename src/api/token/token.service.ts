import crypto from 'crypto'

import { addDays, addMinutes } from 'date-fns'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { MoreThanOrEqual } from 'typeorm'

import { Token } from './token.entity'

import { type User } from '@/api/users'
import { config } from '@/shared/config'
import { dataSource } from '@/shared/database'
import { ApiErrorForbidden } from '@/shared/utils'

const tokenRepository = dataSource.getRepository(Token)

export interface TokenPayload {
  sub: string
  iat: number
  exp: number
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

const generateAccessToken = (
  userId: string,
  options?: SignOptions,
  passphrase = config.jwt.accessTokenPassphrase,
): { token: string; expires: Date } => {
  const expires = addMinutes(
    new Date(),
    config.jwt.accessTokenExpirationMinutes,
  )
  const payload: TokenPayload = {
    sub: userId,
    iat: new Date().getTime(),
    exp: expires.getTime(),
  }
  const secret = {
    key: Buffer.from(config.jwt.accessTokenPrivateKey, 'base64'),
    passphrase,
  }
  const signOptions: SignOptions = {
    ...(options != null && options),
    algorithm: 'RS256',
  }
  const token = jwt.sign(payload, secret, signOptions)

  return {
    token,
    expires,
  }
}

const generateRefreshToken = async (userId: string): Promise<Token> => {
  const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`
  const expires = addDays(new Date(), config.jwt.refreshTokenExpirationDays)
  return await tokenRepository.save({
    token,
    userId,
    expires,
    blacklisted: false,
  })
}

export const generateTokens = async (user: User): Promise<AuthTokens> => {
  const accessToken = generateAccessToken(user.id)
  const refreshToken = await generateRefreshToken(user.id)
  return {
    access: {
      token: accessToken.token,
      expires: accessToken.expires,
    },
    refresh: {
      token: refreshToken.token,
      expires: refreshToken.expires,
    },
  }
}

export const verifyRefreshToken = async (
  refreshToken: string,
): Promise<Token> => {
  const token = await tokenRepository.findOneBy({
    token: refreshToken,
    blacklisted: false,
    expires: MoreThanOrEqual(new Date()),
  })
  if (token == null) {
    throw new ApiErrorForbidden()
  }

  return token
}

export const revokeRefreshToken = async (token: string): Promise<void> => {
  await tokenRepository.delete(token)
}
