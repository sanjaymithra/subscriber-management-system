import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.js'
import {
  deletePayment,
  getPaymentHistory,
  getPaymentModule,
  getPaymentStats,
  listPayments,
  renewSubscription,
  updatePayment,
} from './payments.controller.js'
import {
  paymentListQuerySchema,
  paymentParamsSchema,
  renewSubscriptionBodySchema,
  updatePaymentBodySchema,
} from './payments.validator.js'

export const paymentRoutes = Router()

paymentRoutes.get('/module', getPaymentModule)
paymentRoutes.get('/stats', getPaymentStats)
paymentRoutes.get('/subscriber/:id', getPaymentHistory)
paymentRoutes.get('/', validateRequest({ query: paymentListQuerySchema }), listPayments)
paymentRoutes.post('/renew', validateRequest({ body: renewSubscriptionBodySchema }), renewSubscription)
paymentRoutes.put('/:id', validateRequest({ body: updatePaymentBodySchema, params: paymentParamsSchema }), updatePayment)
paymentRoutes.delete('/:id', validateRequest({ params: paymentParamsSchema }), deletePayment)
