import { type Request, type RequestHandler } from 'express'
import passport from 'passport'

import { messages } from '../constants'

import { type User } from '@/api/users'
import { roleRights } from '@/shared/config'
import { ApiErrorForbidden, ApiErrorUnauthorized } from '@/shared/utils'

type AuthMiddleware = (...requiredRights: string[]) => RequestHandler
type LoginMiddleware = () => RequestHandler

const authenticateCallback =
  (
    req: Request,
    resolve: (value: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void,
    requiredRights: string[],
  ) =>
  (err: any, user: User | false): void => {
    if (err != null) {
      reject(err)
      return
    }
    if (user === false) {
      reject(new ApiErrorUnauthorized())
      return
    }
    req.user = user

    // 権限判定
    if (requiredRights.length > 0) {
      const userRights = roleRights.get(user.role)
      const hasRequiredRights =
        userRights != null &&
        requiredRights.every((requiredRight) =>
          userRights.includes(requiredRight),
        )

      if (!hasRequiredRights && req.params.userId !== user.id) {
        reject(new ApiErrorForbidden())
        return
      }
    }
    resolve()
  }

const loginCallback =
  (
    req: Request,
    resolve: (value: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void,
  ) =>
  (err: any, user: User | false): void => {
    if (err != null) {
      reject(err)
      return
    }
    if (user === false) {
      reject(new ApiErrorUnauthorized(messages.ERR_LOGIN))
    }

    req.user = user
    resolve()
  }

/**
 * 認可
 */
export const auth: AuthMiddleware =
  (...requiredRights: string[]) =>
  async (req, res, next) => {
    await new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        authenticateCallback(req, resolve, reject, requiredRights),
      )(req, res, next)
    })
      .then(next)
      .catch(next)
  }

/**
 * 認証
 */
export const login: LoginMiddleware = () => async (req, res, next) => {
  await new Promise((resolve, reject) => {
    passport.authenticate(
      'local',
      { session: false },
      loginCallback(req, resolve, reject),
    )(req, res, next)
  })
    .then(next)
    .catch(next)
}
