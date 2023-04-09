import { pino } from 'pino'

import { config } from './config'

export const logger = pino({
  level: config.logger.level,
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    },
  },
})
