import { type Server } from 'http'

import app from '@/app'
import { config, logger } from '@/shared/config'
import { dataSource } from '@/shared/database/data-source'

let server: Server | undefined

dataSource
  .initialize()
  .then(() => {
    server = app.listen(config.port, () => {
      logger.info(`Server started on port ${config.port} (${config.env})`)
    })
  })
  .catch((error: any) => {
    logger.error(error)
  })

const serverCloseCallback = (code?: number) => () => {
  logger.info('Server closed.')
  process.exit(code)
}

const exitHandler = (): void => {
  if (server != null) {
    server.close(serverCloseCallback(1))
  }
}

const unexpectedErrorHandler = (error: Error): void => {
  logger.error(error)
  exitHandler()
}

const unhandledRejectionHandler = (
  reason: Record<string, unknown> | null | undefined,
): void => {
  logger.error(reason)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unhandledRejectionHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received.')
  if (server != null) {
    server.close(serverCloseCallback(0))
  }
})
