import { env } from '../config/env.js'

type LogLevel = 'debug' | 'error' | 'info' | 'warn'

type LogContext = Record<string, unknown>

function write(level: LogLevel, message: string, context: LogContext = {}) {
  const payload = {
    context,
    level,
    message,
    timestamp: new Date().toISOString(),
  }

  if (env.NODE_ENV === 'production') {
    process.stdout.write(`${JSON.stringify(payload)}\n`)
    return
  }

  const renderedContext = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : ''
  process.stdout.write(`[${payload.timestamp}] ${level.toUpperCase()}: ${message}${renderedContext}\n`)
}

export const logger = {
  debug: (message: string, context?: LogContext) => write('debug', message, context),
  error: (message: string, context?: LogContext) => write('error', message, context),
  info: (message: string, context?: LogContext) => write('info', message, context),
  warn: (message: string, context?: LogContext) => write('warn', message, context),
}
