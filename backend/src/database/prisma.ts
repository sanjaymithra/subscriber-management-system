import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
})

export const prisma = new PrismaClient({
  adapter,
  log: ['warn'],
})

export async function connectDatabase() {
  await prisma.$connect()
  logger.info('Database connection established')
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
  logger.info('Database connection closed')
}

export async function getDatabaseStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return 'connected' as const
  } catch {
    return 'disconnected' as const
  }
}
