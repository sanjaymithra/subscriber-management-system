import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { PaymentService } from './payments.service.js'
import type { PaymentListQuery, RenewSubscriptionInput, UpdatePaymentInput } from './payments.types.js'

const paymentService = new PaymentService()

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export const getPaymentModule = asyncHandler(async (_request, response) => {
  sendSuccess(response, HTTP_STATUS.OK, 'Payments module foundation ready', paymentService.getModuleStatus())
})

export const deletePayment = asyncHandler(async (request, response) => {
  const recordedByEmail = String(request.query.recordedByEmail ?? '')
  const payment = await paymentService.deletePayment(getParam(request.params.id), recordedByEmail)

  sendSuccess(response, HTTP_STATUS.OK, 'Payment deleted successfully', payment)
})

export const getPaymentHistory = asyncHandler(async (request, response) => {
  const payments = await paymentService.getPaymentHistory(getParam(request.params.id))

  sendSuccess(response, HTTP_STATUS.OK, 'Payment history fetched successfully', payments)
})

export const getPaymentStats = asyncHandler(async (_request, response) => {
  const stats = await paymentService.getPaymentStats()

  sendSuccess(response, HTTP_STATUS.OK, 'Payment statistics fetched successfully', stats)
})

export const listPayments = asyncHandler(async (request, response) => {
  const result = await paymentService.listPayments(request.query as unknown as PaymentListQuery)

  sendSuccess(response, HTTP_STATUS.OK, 'Payments fetched successfully', result.data, result.meta)
})

export const renewSubscription = asyncHandler(async (request, response) => {
  const result = await paymentService.renewSubscription(request.body as RenewSubscriptionInput)

  sendSuccess(response, HTTP_STATUS.CREATED, 'Subscription renewed successfully', result)
})

export const updatePayment = asyncHandler(async (request, response) => {
  const payment = await paymentService.updatePayment(getParam(request.params.id), request.body as UpdatePaymentInput)

  sendSuccess(response, HTTP_STATUS.OK, 'Payment updated successfully', payment)
})
