import httpStatus from 'http-status'
import morgan from 'morgan'

import { config } from './config'
import { logger } from './logger'

const getIpFormat = (): string =>
  config.env === 'production' ? ':remote-addr - ' : ''
const responseFormat = `${getIpFormat()}:method :url :status - :response-time ms`

const success = morgan(responseFormat, {
  skip: (_, res) => res.statusCode >= httpStatus.BAD_REQUEST,
  stream: {
    write: (message) => logger.info(message.trim()),
  },
})

const error = morgan(responseFormat, {
  skip: (_, res) => res.statusCode < httpStatus.BAD_REQUEST,
  stream: {
    write: (message) => logger.error(message.trim()),
  },
})

export const morganHandler = {
  success,
  error,
}
