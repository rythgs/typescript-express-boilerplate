import {
  Strategy as JwtStrategy,
  type JwtFromRequestFunction,
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import { dataSource } from '../database/data-source'

import { config } from './config'

import { TokenType, type tokenService } from '@/api/token'
import { User, userService } from '@/api/users'

const cookieExtractor =
  (cookieName: string): JwtFromRequestFunction =>
  (req) => {
    let token = null
    if (req.cookies != null) {
      token = req.cookies[cookieName]
    }
    return token
  }

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor('access_token'),
    secretOrKey: Buffer.from(config.jwt.accessTokenPublicKey, 'base64'),
    algorithms: ['RS256'],
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (payload: tokenService.TokenPayload, done) => {
    try {
      if (payload.type !== TokenType.Access) {
        throw new Error('Invalid Token.')
      }
      const user = await userService.getUserById(payload.sub)
      if (user == null) {
        done(null, false)
        return
      }

      done(null, user)
    } catch (error) {
      done(error, false)
    }
  },
)

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (username: string, password: string, done) => {
    try {
      const user = await dataSource
        .createQueryBuilder()
        .select(['users.id', 'users.email', 'users.password'])
        .from(User, 'users')
        .where({ email: username })
        .getOne()

      if (user == null) {
        done(null, false)
        return
      }

      if (!(await user.isPasswordMatch(password))) {
        done(null, false)
        return
      }

      done(null, user)
    } catch (error) {
      done(error, false)
    }
  },
)
