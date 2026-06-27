import type { ReportKpi } from '../../types/report'

export const reportKpis: ReportKpi[] = [
  { label: 'Total Revenue', value: '₹4,28,450', trend: '+12.4%', up: true },
  { label: 'Active Subscribers', value: '12,842', trend: '+3.1%', up: true },
  { label: 'Renewal Rate', value: '84.2%', trend: '-1.2%', up: false },
  { label: 'Avg. Revenue/User', value: '₹33.36', trend: '+0.5%', up: true },
]

export const revenueBars = [40, 55, 65, 85, 70, 90]
export const revenueMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const planPopularity = ['Premium', 'Monthly', 'Basic']
export const planPopularityValues = [62, 24, 14]
