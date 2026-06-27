import type { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '../constants/httpStatus.js'
import { AppError } from '../errors/AppError.js'

export function notFoundMiddleware(request: Request, _response: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${request.method} ${request.originalUrl}`, HTTP_STATUS.NOT_FOUND))
}
