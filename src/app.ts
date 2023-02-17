import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import passport from 'passport'

import routes from '@/routes/v1'
import { config } from '@/shared/config/config'
import { morganHandler } from '@/shared/config/morgan'
import { jwtStrategy, localStrategy } from '@/shared/config/passport'
import { handleErrors } from '@/shared/middleware/error.middleware'
import { authLimiter } from '@/shared/middleware/rate-limit.middleware'
import { ApiErrorNotFound } from '@/shared/utils/ApiError'

const app = express()

if (config.env !== 'test') {
  app.use(morganHandler.success)
  app.use(morganHandler.error)
}

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())
app.use(cors())

// jwt authentication
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)
passport.use('local', localStrategy)

if (config.env === 'production') {
  app.use('/rest/v1/auth', authLimiter)
}

// api routes
app.use('/rest/v1', routes)

// unhandled routes
app.all('*', (req, res, next) => {
  next(new ApiErrorNotFound())
})

// global error handling
app.use(handleErrors)

export default app
