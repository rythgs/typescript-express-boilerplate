import { type Server } from 'http'

import { createHttpTerminator, type HttpTerminator } from 'http-terminator'

import app from '@/app'
import { config, logger } from '@/shared/config'
import { dataSource } from '@/shared/database'
import { errorHandler, exitHandler } from '@/shared/utils'

export let server: Server | undefined
export let httpTerminator: HttpTerminator | undefined

process.on('unhandledRejection', (reason: Error | any) => {
  logger.error(`Unhandled Rejection:`, reason?.message ?? reason)
  throw new Error(reason?.message ?? reason)
})

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`)
  errorHandler(error)
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
    server = app.listen(config.port, () => {
      logger.info(`Server started on port ${config.port} (${config.env})`)
    })
    httpTerminator = createHttpTerminator({ server })
  } catch (error) {
    logger.error(`Server bootstrap error.`, error)
    void exitHandler(1)
  }
}

void bootstrap()
