import winston, { createLogger } from 'winston'

import { config } from './config'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

export const logger = createLogger({
  level: config.logger.level,
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(
      ({ level, message }) => `${level}: ${message as string}`,
    ),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})
