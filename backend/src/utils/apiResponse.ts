import type { Response } from 'express'
import type { ApiMeta, ApiSuccessResponse } from '../types/api.js'

export function sendSuccess<TData>(
  response: Response,
  statusCode: number,
  message: string,
  data: TData,
  meta: ApiMeta = {},
) {
  const payload: ApiSuccessResponse<TData> = {
    success: true,
    message,
    data,
    meta,
  }

  return response.status(statusCode).json(payload)
}
