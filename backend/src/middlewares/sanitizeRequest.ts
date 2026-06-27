import type { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '../constants/httpStatus.js'
import { AppError } from '../errors/AppError.js'

function hasUnsafeKey(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false
  }

  return Object.entries(value).some(([key, nestedValue]) => {
    if (key.startsWith('$') || key.includes('.')) {
      return true
    }

    return hasUnsafeKey(nestedValue)
  })
}

function sanitizeObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.startsWith('$') && !key.includes('.'))
      .map(([key, nestedValue]) => [key, sanitizeObject(nestedValue)]),
  )
}

export function sanitizeRequest(request: Request, _response: Response, next: NextFunction) {
  if (hasUnsafeKey(request.query)) {
    return next(new AppError('Unsafe query parameters detected', HTTP_STATUS.BAD_REQUEST))
  }

  request.body = sanitizeObject(request.body)
  request.params = sanitizeObject(request.params) as Record<string, string>

  return next()
}
