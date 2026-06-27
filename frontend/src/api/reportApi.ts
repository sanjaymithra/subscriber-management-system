import { api } from './api'
import type { ApiResponse } from '../types/api'
import type { ReportFilters, ReportSummary } from '../types/report'

export async function getReportSummary(filters: ReportFilters) {
  const response = await api.get<ApiResponse<ReportSummary>>('/reports', { params: filters })

  return response.data.data
}
