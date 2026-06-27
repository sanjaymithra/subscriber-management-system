import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePayment, getPaymentHistory, getPayments, renewSubscription } from '../api/paymentApi'
import type { PaymentFilters, RenewSubscriptionInput } from '../types/payment'

export const defaultPaymentFilters: PaymentFilters = {
  limit: 10,
  page: 1,
  sortBy: 'paymentDate',
  sortOrder: 'desc',
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePayment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['payments'] }),
        queryClient.invalidateQueries({ queryKey: ['payment-history'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
      ])
    },
  })
}

export function usePaymentHistory(subscriberId: string | undefined) {
  return useQuery({
    enabled: Boolean(subscriberId),
    queryFn: () => getPaymentHistory(subscriberId ?? ''),
    queryKey: ['payment-history', subscriberId],
  })
}

export function usePaymentsData(filters: PaymentFilters) {
  return useQuery({
    queryFn: () => getPayments(filters),
    queryKey: ['payments', filters],
  })
}

export function useRenewSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RenewSubscriptionInput) => renewSubscription(input),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['payments'] }),
        queryClient.invalidateQueries({ queryKey: ['payment-history', variables.subscriberId] }),
        queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
        queryClient.invalidateQueries({ queryKey: ['subscriber', variables.subscriberId] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
      ])
    },
  })
}
