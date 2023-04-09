import http from 'http'

import { createHttpTerminator } from 'http-terminator'

import app from '@/app'
import { config } from '@/shared/config/config'
import { hooks } from '@/shared/config/hooks'
import { logger } from '@/shared/config/logger'
import { dataSource } from '@/shared/database/data-source'
import { errorHandler } from '@/shared/utils/errorHandler'
import { createExitHandler } from '@/shared/utils/exitHandler'

const server = http.createServer(app)
const httpTerminator = createHttpTerminator({ server })

const exitHandler = createExitHandler(server, httpTerminator)

process.on('unhandledRejection', (reason: Error | unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason)
  logger.error(`Unhandled Rejection: %s`, message)
  throw new Error(message)
})

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`)
  errorHandler(error)
})

hooks.on('untrustedError', () => {
  void exitHandler(1)
})

process.on('SIGTERM', () => {
  logger.info(`Process ${process.pid} received SIGTERM: Exiting with code 0`)
  void exitHandler(0)
})

process.on('SIGINT', () => {
  logger.info(`Process ${process.pid} received SIGINT: Exiting with code 0`)
  void exitHandler(0)
})

const bootstrap = async (): Promise<void> => {
  try {
    await dataSource.initialize()
    server.listen(config.port, () => {
      logger.info(`Server started on port ${config.port} (${config.env})`)
    })
  } catch (error) {
    logger.error(`Server bootstrap error. %o`, error)
    void exitHandler(1)
  }
}

void bootstrap()
