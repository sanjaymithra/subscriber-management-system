import { HTTP_STATUS } from '../constants/httpStatus.js'
import { getDatabaseStatus } from '../database/prisma.js'
import type { HealthStatus } from '../types/api.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { env } from '../config/env.js'

export const getHealth = asyncHandler(async (_request, response) => {
  const database = await getDatabaseStatus()

  const health: HealthStatus = {
    database,
    environment: env.NODE_ENV,
    status: database === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }

  sendSuccess(response, HTTP_STATUS.OK, 'Health check completed', health)
})
