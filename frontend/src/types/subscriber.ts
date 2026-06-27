export type Subscriber = {
  address: string
  city: string
  createdAt: string
  deliveryBoy: string
  email: string
  expiryDate: string
  fullName: string
  id: string
  newspaperType: string
  notes?: string | null
  paymentStatus: string
  phone: string
  pincode: string
  startDate: string
  subscriberId: string
  subscriptionPlan: string
  subscriptionStatus: string
  updatedAt: string
}

export type SubscriptionPlan = {
  active: boolean
  icon: string
  name: string
  price: string
}

export type SubscriberFilters = {
  expiringSoon?: boolean
  limit: number
  newspaperType?: string
  page: number
  search?: string
  sortBy: 'createdAt' | 'expiryDate' | 'fullName'
  sortOrder: 'asc' | 'desc'
  subscriptionPlan?: string
  subscriptionStatus?: string
}

export type SubscriberFormInput = {
  address: string
  city: string
  deliveryBoy: string
  email: string
  expiryDate: string
  fullName: string
  newspaperType: string
  notes: string
  paymentStatus: string
  phone: string
  pincode: string
  startDate: string
  subscriberId: string
  subscriptionPlan: string
}

export type SubscriberStats = {
  activeSubscribers: number
  expiredSubscribers: number
  expiringSoon: number
  monthlyRevenue?: {
    label: string
    month: number
    revenue: number
    year: number
  }[]
  paymentStats?: {
    renewalsToday: number
    thisMonthCollection: number
    todayCollection: number
    totalRevenue: number
  }
  pendingSubscribers: number
  totalSubscribers: number
}
