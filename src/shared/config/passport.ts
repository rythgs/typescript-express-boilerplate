import {
  Strategy as JwtStrategy,
  type JwtFromRequestFunction,
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import { config } from './config'

import { type tokenService } from '@/api/auth'
import { User, userService } from '@/api/users'
import { dataSource } from '@/shared/database/data-source'

const cookieExtractor =
  (cookieName: string): JwtFromRequestFunction =>
  (req) => {
    let token = null
    // TODO: `as` したくない
    const cookies =
      req.cookies != null
        ? (req.cookies as { access_token: string; [key: string]: string })
        : null
    if (cookies != null) {
      token = cookies[cookieName]
    }
    return token
  }

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor('access_token'),
    secretOrKey: Buffer.from(config.jwt.accessTokenPublicKey, 'base64'),
    algorithms: ['RS256'],
  },
  (payload: tokenService.TokenPayload, done) => {
    void (async () => {
      try {
        const user = await userService.getUserById(payload.sub)
        if (user == null) {
          done(null, false)
          return
        }

        done(null, user)
      } catch (error) {
        done(error, false)
      }
    })()
  },
)

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  (username: string, password: string, done) => {
    void (async () => {
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
    })()
  },
)
