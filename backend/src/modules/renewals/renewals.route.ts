import { Router } from 'express'
import { getRenewalModule } from './renewals.controller.js'

export const renewalRoutes = Router()

renewalRoutes.get('/', getRenewalModule)
