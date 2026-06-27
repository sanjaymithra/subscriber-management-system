import type { CorsOptions } from 'cors'
import { env } from './env.js'

const developmentOrigins = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/]

export const corsOptions: CorsOptions = {
  credentials: true,
  origin: env.NODE_ENV === 'production' ? env.CLIENT_URL : [env.CLIENT_URL, ...developmentOrigins],
}
