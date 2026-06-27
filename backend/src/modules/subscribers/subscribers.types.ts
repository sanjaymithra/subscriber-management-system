import type { Subscriber } from '@prisma/client'

export type SubscriberSortBy = 'createdAt' | 'expiryDate' | 'fullName'
export type SortOrder = 'asc' | 'desc'

export type SubscriberListQuery = {
  expiringSoon?: boolean
  limit: number
  newspaperType?: string
  page: number
  search?: string
  sortBy: SubscriberSortBy
  sortOrder: SortOrder
  subscriptionPlan?: string
  subscriptionStatus?: string
}

export type CreateSubscriberInput = Omit<Subscriber, 'createdAt' | 'id' | 'subscriptionStatus' | 'updatedAt'>
export type UpdateSubscriberInput = Partial<CreateSubscriberInput>

export type SubscriberListResult = {
  subscribers: Subscriber[]
  total: number
}

export type SubscriberStats = {
  activeSubscribers: number
  expiredSubscribers: number
  expiringSoon: number
  pendingSubscribers: number
  totalSubscribers: number
}
