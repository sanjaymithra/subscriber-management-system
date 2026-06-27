export type ReportModuleStatus = 'ready'

export type ReportDatePreset = 'custom' | 'lastMonth' | 'thisMonth' | 'thisWeek'
export type RevenueSortBy = 'amount' | 'date'
export type SortOrder = 'asc' | 'desc'

export type ReportQuery = {
  datePreset?: ReportDatePreset
  endDate?: Date
  paymentMethod?: string
  plan?: string
  revenueSortBy: RevenueSortBy
  revenueSortOrder: SortOrder
  search?: string
  staffMember?: string
  startDate?: Date
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
  date: Date
  paymentMethod: string
  staffMember: string
  subscriberId: string
  subscriberName: string
  transactionReference: null | string
}

export type SubscriberReportRow = {
  expiryDate: Date
  lastPayment: Date | null
  plan: string
  status: string
  subscriberId: string
  subscriberName: string
}

export type ChartPoint = {
  label: string
  value: number
}

export type QuickStatistics = {
  averageSubscriptionValue: number
  mostPopularPlan: string
  mostUsedPaymentMethod: string
  totalActiveRevenue: number
  totalPaymentRecords: number
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
  quickStats: QuickStatistics
  revenueRows: RevenueReportRow[]
  subscriberRows: SubscriberReportRow[]
}
