export class AppError extends Error {
  readonly errors: Array<{ field?: string; message: string }>
  readonly isOperational: boolean
  readonly statusCode: number

  constructor(
    message: string,
    statusCode: number,
    errors: Array<{ field?: string; message: string }> = [],
    isOperational = true,
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}
