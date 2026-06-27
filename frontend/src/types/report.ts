export type ReportKpi = {
  label: string
  trend: string
  up: boolean
  value: string
}

export type ReportDatePreset = 'custom' | 'lastMonth' | 'thisMonth' | 'thisWeek'

export type ReportFilters = {
  datePreset: ReportDatePreset
  endDate?: string
  paymentMethod?: string
  plan?: string
  revenueSortBy: 'amount' | 'date'
  revenueSortOrder: 'asc' | 'desc'
  search?: string
  staffMember?: string
  startDate?: string
  status?: string
}

export type ReportCard = {
  key: string
  label: string
  value: number
  valueType: 'currency' | 'number'
}

export type RevenueReportRow = {
  amount: number
  date: string
  paymentMethod: string
  staffMember: string
  subscriberId: string
  subscriberName: string
  transactionReference: null | string
}

export type SubscriberReportRow = {
  expiryDate: string
  lastPayment: null | string
  plan: string
  status: string
  subscriberId: string
  subscriberName: string
}

export type ChartPoint = {
  label: string
  value: number
}

export type ReportSummary = {
  cards: ReportCard[]
  charts: {
    paymentMethodDistribution: ChartPoint[]
    renewalsByMonth: ChartPoint[]
    revenueByMonth: ChartPoint[]
    subscriberStatusDistribution: ChartPoint[]
  }
  filters: {
    paymentMethods: string[]
    plans: string[]
    staffMembers: string[]
    statuses: string[]
  }
  quickStats: {
    averageSubscriptionValue: number
    mostPopularPlan: string
    mostUsedPaymentMethod: string
    totalActiveRevenue: number
    totalPaymentRecords: number
  }
  revenueRows: RevenueReportRow[]
  subscriberRows: SubscriberReportRow[]
}
