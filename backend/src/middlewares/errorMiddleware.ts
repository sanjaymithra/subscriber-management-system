import type { ErrorRequestHandler } from 'express'
import { env } from '../config/env.js'
import { HTTP_STATUS } from '../constants/httpStatus.js'
import { AppError } from '../errors/AppError.js'
import type { ApiErrorResponse } from '../types/api.js'
import { logger } from '../utils/logger.js'

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, next) => {
  void next
  const appError = error instanceof AppError
    ? error
    : new AppError('Internal server error', HTTP_STATUS.INTERNAL_SERVER_ERROR, [], false)

  if (!(error instanceof AppError) || (env.NODE_ENV !== 'production' && appError.statusCode >= 500)) {
    logger.error(error instanceof Error ? error.message : 'Unknown error', {
      stack: error instanceof Error ? error.stack : undefined,
    })
  }

  const payload: ApiErrorResponse = {
    success: false,
    message: appError.message,
    errors: appError.errors.length > 0 ? appError.errors : [{ message: appError.message }],
  }

  response.status(appError.statusCode).json(payload)
}
