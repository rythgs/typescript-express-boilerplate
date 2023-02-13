import { rateLimit } from 'express-rate-limit'

export const authLimiter = rateLimit({
  // 15 minutes
  windowMs: 15 * 60 * 1000,
  // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  max: 20,
  skipSuccessfulRequests: true,
})
