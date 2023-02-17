import { Server } from 'http'

import { HttpTerminator } from 'http-terminator'

import { logger } from '@/shared/config/logger'
import { dataSource } from '@/shared/database/data-source'

export const createExitHandler =
  (server: Server, httpTerminator: HttpTerminator) =>
  async (code: number, timeout = 5000) => {
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
