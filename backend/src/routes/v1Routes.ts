import { Router } from 'express'
import { authRoutes } from '../modules/auth/auth.route.js'
import { dashboardRoutes } from '../modules/dashboard/dashboard.route.js'
import { paymentRoutes } from '../modules/payments/payments.route.js'
import { renewalRoutes } from '../modules/renewals/renewals.route.js'
import { reportRoutes } from '../modules/reports/reports.route.js'
import { settingsRoutes } from '../modules/settings/settings.route.js'
import { subscriberRoutes } from '../modules/subscribers/subscribers.route.js'

export const v1Routes = Router()

v1Routes.use('/auth', authRoutes)
v1Routes.use('/dashboard', dashboardRoutes)
v1Routes.use('/subscribers', subscriberRoutes)
v1Routes.use('/payments', paymentRoutes)
v1Routes.use('/renewals', renewalRoutes)
v1Routes.use('/reports', reportRoutes)
v1Routes.use('/settings', settingsRoutes)
