import { app } from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './database/prisma.js'
import { seedDemoUsers } from './modules/auth/demoUsers.seed.js'
import { backfillInitialPaidSubscriberPayments } from './modules/payments/initialPayments.js'
import { logger } from './utils/logger.js'

async function bootstrap() {
  try {
    try {
      await connectDatabase()
      if (env.NODE_ENV === 'development') {
        await seedDemoUsers()
      }
      await backfillInitialPaidSubscriberPayments()
    } catch (error) {
      logger.warn('Database connection unavailable at startup; health route will report degraded status', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`API server listening on port ${env.PORT}`, {
        environment: env.NODE_ENV,
      })
    })

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully.`)
      server.close(async () => {
        await disconnectDatabase()
        process.exit(0)
      })
    }

    process.on('SIGINT', () => {
      void shutdown('SIGINT')
    })
    process.on('SIGTERM', () => {
      void shutdown('SIGTERM')
    })
  } catch (error) {
    logger.error('Failed to start API server', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    process.exit(1)
  }
}

void bootstrap()
