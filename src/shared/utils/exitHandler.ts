import { httpTerminator, server } from '@/index'
import { logger } from '@/shared/config'
import { dataSource } from '@/shared/database'

export const exitHandler = async (
  code: number,
  timeout = 5000,
): Promise<void> => {
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
