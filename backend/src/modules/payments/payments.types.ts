import type { Payment, Subscriber, User } from '@prisma/client'

export type PaymentModuleStatus = 'ready'

export type PaymentMethod = 'Bank Transfer' | 'Card' | 'Cash' | 'UPI'
export type PaymentStatus = 'Paid' | 'Pending'
export type PaymentSortBy = 'createdAt' | 'paymentDate' | 'amount'
export type SortOrder = 'asc' | 'desc'

export type PaymentListQuery = {
  endDate?: Date
  limit: number
  month?: number
  page: number
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  search?: string
  sortBy: PaymentSortBy
  sortOrder: SortOrder
  startDate?: Date
  year?: number
}

export type RenewSubscriptionInput = {
  amount: number
  durationMonths: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  recordedByEmail: string
  remarks?: null | string
  subscriberId: string
  transactionReference?: null | string
}

export type UpdatePaymentInput = {
  amount?: number
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  recordedByEmail: string
  remarks?: null | string
  transactionReference?: null | string
}

export type PaymentWithRelations = Payment & {
  recorder: Pick<User, 'email' | 'id' | 'role'>
  subscriber: Pick<Subscriber, 'fullName' | 'id' | 'subscriberId' | 'subscriptionPlan' | 'subscriptionStatus'>
}

export type PaymentDto = Omit<PaymentWithRelations, 'amount'> & {
  amount: number
}

export type PaymentListResult = {
  payments: PaymentDto[]
  total: number
}

export type PaymentStats = {
  renewalsToday: number
  thisMonthCollection: number
  todayCollection: number
  totalRevenue: number
}

export type MonthlyRevenuePoint = {
  label: string
  month: number
  revenue: number
  year: number
}
