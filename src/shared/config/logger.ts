import { createLogger, format, transports } from 'winston'

import { config } from './config'

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

export const logger = createLogger({
  level: config.logger.level,
  format: format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? format.colorize() : format.uncolorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp, ...rest }) => {
      const more = Object.keys(rest).length > 0 ? JSON.stringify(rest) : ''
      return `${timestamp as string} [${level}] ${message as string} ${more}`
    }),
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})
