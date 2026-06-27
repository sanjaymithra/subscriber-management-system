import { Router } from 'express'
import { healthRoutes } from './healthRoutes.js'
import { v1Routes } from './v1Routes.js'

export const apiRoutes = Router()

apiRoutes.use('/health', healthRoutes)
apiRoutes.use('/v1', v1Routes)
