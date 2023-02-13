import { type NextFunction, type Request, type Response } from 'express'

import { errorHandler } from '@/shared/utils'

export const handleErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  errorHandler(error, res)
}
