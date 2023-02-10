import swaggerJsdoc from 'swagger-jsdoc'

import { config } from './config'

export const swaggerDoc = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/rest/v1`,
      },
    ],
  },
  apis: ['src/docs/*.yml', 'src/routes/v1/*.ts'],
})
