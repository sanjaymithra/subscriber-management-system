import morgan from 'morgan'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

const format = env.NODE_ENV === 'production' ? 'combined' : 'dev'

export const requestLogger = morgan(format, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
})
