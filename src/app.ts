import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import passport from 'passport'

import routes from '@/routes/v1'
import {
  config,
  jwtStrategy,
  localStrategy,
  morganHandler,
} from '@/shared/config'
import { handleErrors } from '@/shared/middleware'
import { ApiErrorNotFound } from '@/shared/utils'

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

// api routes
app.use('/rest/v1', routes)

// unhandled routes
app.all('*', (req, res, next) => {
  next(new ApiErrorNotFound())
})

// global error handling
app.use(handleErrors)

export default app
