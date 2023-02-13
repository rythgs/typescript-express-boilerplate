import { type Server } from 'http'

import { createHttpTerminator, type HttpTerminator } from 'http-terminator'

import app from '@/app'
import { config, logger } from '@/shared/config'
import { dataSource } from '@/shared/database/data-source'

let server: Server | undefined
let httpTerminator: HttpTerminator | undefined

const exitHandler = async (code: number, timeout = 5000): Promise<void> => {
  try {
    logger.info(`Start graceful shutdown with code ${code}`)

    setTimeout(() => {
      logger.info(`Force shutdown with code ${code}`)
      process.exit(code)
    }, timeout).unref()

    if (server?.listening ?? false) {
      logger.info('Terminate HTTP connections.')
      await httpTerminator?.terminate()
    }

    if (dataSource.isInitialized) {
      logger.info('Close database connection.')
      await dataSource.destroy()
    }

    logger.info(`End graceful shutdown.`)
    process.exit(code)
  } catch (error) {
    logger.error('Error graceful shutdown.')
    logger.error(error)
    logger.info(`Force shutdown with code ${code}`)
    process.exit(code)
  }
}

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection:`, reason)
  throw new Error('Unhandled Rejection')
})

process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`)
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
