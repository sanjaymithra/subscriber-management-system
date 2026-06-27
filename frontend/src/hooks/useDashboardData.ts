import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../api/dashboardApi'
import { createDashboardCards, emptySubscriberStats } from '../features/dashboard/dashboardData'

export function useDashboardData() {
  return useQuery({
    queryFn: getDashboardSummary,
    queryKey: ['dashboard-summary'],
    select: (stats) => ({
      cards: createDashboardCards(stats),
      stats,
    }),
    placeholderData: emptySubscriberStats,
  })
}
