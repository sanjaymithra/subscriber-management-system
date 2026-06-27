import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { HTTP_STATUS } from '../constants/httpStatus.js'
import { AppError } from '../errors/AppError.js'

type RequestSchemas = {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export function validateRequest(schemas: RequestSchemas) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const validationErrors: Array<{ field?: string; message: string }> = []

    for (const [location, schema] of Object.entries(schemas)) {
      if (!schema) {
        continue
      }

      const requestLocation = location as keyof Pick<Request, 'body' | 'params' | 'query'>
      const result = schema.safeParse(request[requestLocation])

      if (!result.success) {
        validationErrors.push(
          ...result.error.issues.map((issue) => ({
            field: `${location}.${issue.path.join('.')}`,
            message: issue.message,
          })),
        )

        continue
      }

      if (requestLocation === 'query') {
        Object.defineProperty(request, 'query', {
          configurable: true,
          enumerable: true,
          value: result.data,
        })
      } else {
        request[requestLocation] = result.data
      }
    }

    if (validationErrors.length > 0) {
      return next(new AppError('Validation failed', HTTP_STATUS.BAD_REQUEST, validationErrors))
    }

    return next()
  }
}
