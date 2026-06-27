import { useQuery } from '@tanstack/react-query'
import { getReportSummary } from '../api/reportApi'
import type { ReportFilters } from '../types/report'

export const defaultReportFilters: ReportFilters = {
  datePreset: 'thisMonth',
  revenueSortBy: 'date',
  revenueSortOrder: 'desc',
}

export function useReportsData(filters: ReportFilters) {
  return useQuery({
    queryFn: () => getReportSummary(filters),
    queryKey: ['report-summary', filters],
    staleTime: 60_000,
  })
}
