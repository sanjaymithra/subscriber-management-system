import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { getReportModule, getReportSummary } from './reports.controller.js'
import { reportQuerySchema } from './reports.validator.js'

export const reportRoutes = Router()

reportRoutes.get('/module', getReportModule)
reportRoutes.get('/', validateRequest({ query: reportQuerySchema }), getReportSummary)
