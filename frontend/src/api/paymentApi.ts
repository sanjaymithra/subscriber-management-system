import { getCurrentDemoUserEmail } from './authApi'
import { api } from './api'
import type { ApiResponse, PaginatedMeta } from '../types/api'
import type { Payment, PaymentFilters, PaymentStats, RenewSubscriptionInput, RenewSubscriptionResponse } from '../types/payment'

export type PaymentListResponse = {
  meta: PaginatedMeta
  payments: Payment[]
}

export async function deletePayment(id: string) {
  const response = await api.delete<ApiResponse<Payment>>(`/payments/${id}`, {
    params: { recordedByEmail: getCurrentDemoUserEmail() },
  })

  return response.data.data
}

export async function getPaymentHistory(subscriberId: string) {
  const response = await api.get<ApiResponse<Payment[]>>(`/payments/subscriber/${subscriberId}`)

  return response.data.data
}

export async function getPaymentModuleStatus() {
  return Promise.resolve({ status: 'ready' as const })
}

export async function getPayments(filters: PaymentFilters): Promise<PaymentListResponse> {
  const response = await api.get<ApiResponse<Payment[]>>('/payments', { params: filters })

  return {
    meta: response.data.meta as PaginatedMeta,
    payments: response.data.data,
  }
}

export async function getPaymentStats() {
  const response = await api.get<ApiResponse<PaymentStats>>('/payments/stats')

  return response.data.data
}

export async function renewSubscription(input: RenewSubscriptionInput) {
  const response = await api.post<ApiResponse<RenewSubscriptionResponse>>('/payments/renew', {
    ...input,
    recordedByEmail: getCurrentDemoUserEmail(),
  })

  return response.data.data
}
