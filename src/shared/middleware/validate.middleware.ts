import { type RequestHandler } from 'express'
import { type ZodSchema } from 'zod'

import { ApiErrorBadRequest } from '@/shared/utils/ApiError'

export const validate =
  (
    schema: ZodSchema,
  ): RequestHandler<unknown, unknown, Record<string, unknown>> =>
  (req, res, next) => {
    const parsed = schema.safeParse({
      params: req.params,
      query: req.query,
      body: req.body,
    })
    if (parsed.success) {
      next()
      return
    }
    next(new ApiErrorBadRequest(undefined, parsed.error.errors))
  }
