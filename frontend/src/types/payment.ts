export type PaymentModule = {
  status: 'ready'
}

export type PaymentMethod = 'Bank Transfer' | 'Card' | 'Cash' | 'UPI'
export type PaymentStatus = 'Paid' | 'Pending'

export type Payment = {
  amount: number
  createdAt: string
  durationMonths: number
  id: string
  newExpiryDate: string
  paymentDate: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  previousExpiryDate: string
  recordedBy: string
  recorder: {
    email: string
    id: string
    role: string
  }
  remarks?: null | string
  subscriber: {
    fullName: string
    id: string
    subscriberId: string
    subscriptionPlan: string
    subscriptionStatus: string
  }
  subscriberId: string
  transactionReference?: null | string
  updatedAt: string
}

export type PaymentFilters = {
  endDate?: string
  limit: number
  month?: number
  page: number
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  search?: string
  sortBy: 'amount' | 'createdAt' | 'paymentDate'
  sortOrder: 'asc' | 'desc'
  startDate?: string
  year?: number
}

export type RenewSubscriptionInput = {
  amount: number
  durationMonths: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  remarks?: string
  subscriberId: string
  transactionReference?: string
}

export type RenewSubscriptionResponse = {
  payment: Payment
}

export type PaymentStats = {
  renewalsToday: number
  thisMonthCollection: number
  todayCollection: number
  totalRevenue: number
}
