import { type NextFunction, type Request, type Response } from 'express'

import { errorHandler } from '@/shared/utils/errorHandler'

export const handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  errorHandler(error, res)
}
