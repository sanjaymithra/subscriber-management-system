import { subscriptionPlans } from '../features/subscribers/editSubscriberData'
import type { ApiResponse, PaginatedMeta } from '../types/api'
import type { Subscriber, SubscriberFilters, SubscriberFormInput, SubscriberStats } from '../types/subscriber'
import { api } from './api'

export type SubscribersResponse = {
  subscribers: Subscriber[]
  meta: PaginatedMeta
}

export async function createSubscriber(input: SubscriberFormInput) {
  const response = await api.post<ApiResponse<Subscriber>>('/subscribers', input)
  return response.data.data
}

export async function deleteSubscriber(id: string) {
  const response = await api.delete<ApiResponse<Subscriber>>(`/subscribers/${id}`)
  return response.data.data
}

export async function getSubscriberById(id: string) {
  const response = await api.get<ApiResponse<Subscriber>>(`/subscribers/${id}`)
  return response.data.data
}

export async function getSubscriberStats() {
  const response = await api.get<ApiResponse<SubscriberStats>>('/subscribers/stats')
  return response.data.data
}

export async function getSubscribers(filters: SubscriberFilters): Promise<SubscribersResponse> {
  const response = await api.get<ApiResponse<Subscriber[]>>('/subscribers', {
    params: filters,
  })

  return {
    meta: response.data.meta as PaginatedMeta,
    subscribers: response.data.data,
  }
}

export async function getSubscriptionPlans() {
  return Promise.resolve(subscriptionPlans)
}

export async function updateSubscriber(id: string, input: SubscriberFormInput) {
  const response = await api.put<ApiResponse<Subscriber>>(`/subscribers/${id}`, input)
  return response.data.data
}
