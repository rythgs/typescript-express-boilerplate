import { type RequestHandler } from 'express'
import type * as core from 'express-serve-static-core'

export const asyncHandler =
  <
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query,
  >(
    fn: (
      ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
    ) => Promise<any>,
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  async (req, res, next) =>
    await fn(req, res, next).catch(next)
