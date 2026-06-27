import type { ApiResponse } from '../types/api'
import type { SubscriberStats } from '../types/subscriber'
import { api } from './api'

export async function getDashboardSummary() {
  const response = await api.get<ApiResponse<SubscriberStats>>('/dashboard')
  return response.data.data
}
