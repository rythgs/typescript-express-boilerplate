import express from 'express'
import swaggerUi from 'swagger-ui-express'

import { swaggerDoc } from '@/shared/config/swagger'

const docRouter = express.Router()

docRouter.use('/', swaggerUi.serve)
docRouter.get('/', swaggerUi.setup(swaggerDoc, { explorer: true }))

export { docRouter }
