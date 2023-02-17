import { type RequestHandler } from 'express'
import type * as core from 'express-serve-static-core'

export const asyncHandler =
  <
    P = core.ParamsDictionary,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = core.Query,
  >(
    fn: (
      ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
    ) => Promise<unknown>,
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  async (req, res, next) =>
    fn(req, res, next).catch(next)
