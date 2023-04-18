import express from 'express'

import authRoute from '@/api/auth'
import docRoute from '@/api/docs'
import systemRoute from '@/api/system'
import userRoute from '@/api/users'
import { config } from '@/shared/config/config'

const router = express.Router()

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/system',
    route: systemRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
]

const devRoutes = [
  {
    path: '/docs',
    route: docRoute,
  },
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route)
  })
}

export default router
