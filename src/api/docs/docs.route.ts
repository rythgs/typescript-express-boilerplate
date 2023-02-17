import express from 'express'
import swaggerUi from 'swagger-ui-express'

import { swaggerDoc } from '@/shared/config/swagger'

const router = express.Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDoc, { explorer: true }))

export default router
