import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSubscriber,
  deleteSubscriber,
  getSubscriberById,
  getSubscribers,
  getSubscriptionPlans,
  updateSubscriber,
} from '../api/subscriberApi'
import { subscriptionPlans } from '../features/subscribers/editSubscriberData'
import type { SubscriberFilters, SubscriberFormInput } from '../types/subscriber'

export const defaultSubscriberFilters: SubscriberFilters = {
  limit: 10,
  page: 1,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export function useCreateSubscriber() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSubscriber,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
      ])
    },
  })
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
      ])
    },
  })
}

export function useSubscribersData(filters: SubscriberFilters) {
  return useQuery({
    queryFn: () => getSubscribers(filters),
    queryKey: ['subscribers', filters],
    retry: 1,
  })
}

export function useSubscriberData(id: string | undefined) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => getSubscriberById(id ?? ''),
    queryKey: ['subscriber', id],
  })
}

export function useSubscriptionPlans() {
  return useQuery({
    initialData: subscriptionPlans,
    queryFn: getSubscriptionPlans,
    queryKey: ['subscription-plans'],
  })
}

export function useUpdateSubscriber(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SubscriberFormInput) => updateSubscriber(id, input),
    onSuccess: async (subscriber) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
        queryClient.invalidateQueries({ queryKey: ['subscriber', id] }),
        queryClient.invalidateQueries({ queryKey: ['subscriber', subscriber.subscriberId] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
      ])
    },
  })
}
