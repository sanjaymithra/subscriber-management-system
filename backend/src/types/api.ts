export type ApiMeta = Record<string, string | number | boolean | null>

export type ApiSuccessResponse<TData = null> = {
  success: true
  message: string
  data: TData
  meta: ApiMeta
}

export type ApiErrorResponse = {
  success: false
  message: string
  errors: Array<{
    field?: string
    message: string
  }>
}

export type HealthStatus = {
  database: 'connected' | 'disconnected'
  environment: string
  status: 'ok' | 'degraded'
  timestamp: string
  uptime: number
}
