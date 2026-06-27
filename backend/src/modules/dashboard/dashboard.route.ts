import { Router } from 'express'
import { getDashboardModule } from './dashboard.controller.js'

export const dashboardRoutes = Router()

dashboardRoutes.get('/', getDashboardModule)
