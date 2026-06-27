import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { SubscriberService } from './subscribers.service.js'
import type { CreateSubscriberInput, SubscriberListQuery, UpdateSubscriberInput } from './subscribers.types.js'

const subscriberService = new SubscriberService()

function getRouteId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? ''
}

export const createSubscriber = asyncHandler(async (request, response) => {
  const subscriber = await subscriberService.createSubscriber(request.body as CreateSubscriberInput)

  sendSuccess(response, HTTP_STATUS.CREATED, 'Subscriber created successfully', subscriber)
})

export const deleteSubscriber = asyncHandler(async (request, response) => {
  const subscriber = await subscriberService.deleteSubscriber(getRouteId(request.params.id))

  sendSuccess(response, HTTP_STATUS.OK, 'Subscriber deleted successfully', subscriber)
})

export const getSubscriber = asyncHandler(async (request, response) => {
  const subscriber = await subscriberService.getSubscriber(getRouteId(request.params.id))

  sendSuccess(response, HTTP_STATUS.OK, 'Subscriber fetched successfully', subscriber)
})

export const getSubscriberStats = asyncHandler(async (_request, response) => {
  const stats = await subscriberService.getDashboardStats()

  sendSuccess(response, HTTP_STATUS.OK, 'Subscriber statistics fetched successfully', stats)
})

export const listSubscribers = asyncHandler(async (request, response) => {
  const result = await subscriberService.listSubscribers(request.query as unknown as SubscriberListQuery)

  sendSuccess(response, HTTP_STATUS.OK, 'Subscribers fetched successfully', result.data, result.meta)
})

export const updateSubscriber = asyncHandler(async (request, response) => {
  const subscriber = await subscriberService.updateSubscriber(
    getRouteId(request.params.id),
    request.body as UpdateSubscriberInput,
  )

  sendSuccess(response, HTTP_STATUS.OK, 'Subscriber updated successfully', subscriber)
})
