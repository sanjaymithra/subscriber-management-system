import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { corsOptions } from './config/cors.js'
import { apiRateLimiter } from './middlewares/rateLimiter.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import { notFoundMiddleware } from './middlewares/notFound.js'
import { requestLogger } from './middlewares/requestLogger.js'
import { sanitizeRequest } from './middlewares/sanitizeRequest.js'
import { apiRoutes } from './routes/index.js'

export const app = express()

app.disable('x-powered-by')
app.disable('etag')

app.use(helmet())
app.use(cors(corsOptions))
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(sanitizeRequest)
app.use(requestLogger)
app.use('/api', apiRateLimiter, apiRoutes)
app.use(notFoundMiddleware)
app.use(errorMiddleware)
