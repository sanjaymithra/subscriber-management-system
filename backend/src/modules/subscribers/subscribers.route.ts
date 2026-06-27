import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.js'
import {
  createSubscriber,
  deleteSubscriber,
  getSubscriber,
  getSubscriberStats,
  listSubscribers,
  updateSubscriber,
} from './subscribers.controller.js'
import {
  subscriberBodySchema,
  subscriberListQuerySchema,
  subscriberParamsSchema,
  updateSubscriberBodySchema,
} from './subscribers.validator.js'

export const subscriberRoutes = Router()

subscriberRoutes.get('/stats', getSubscriberStats)
subscriberRoutes.get('/', validateRequest({ query: subscriberListQuerySchema }), listSubscribers)
subscriberRoutes.get('/:id', validateRequest({ params: subscriberParamsSchema }), getSubscriber)
subscriberRoutes.post('/', validateRequest({ body: subscriberBodySchema }), createSubscriber)
subscriberRoutes.put(
  '/:id',
  validateRequest({ body: updateSubscriberBodySchema, params: subscriberParamsSchema }),
  updateSubscriber,
)
subscriberRoutes.delete('/:id', validateRequest({ params: subscriberParamsSchema }), deleteSubscriber)
