import { useState } from 'react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { RenewalModal } from '../features/payments/RenewalModal'
import { defaultPaymentFilters, useDeletePayment, usePaymentsData } from '../hooks/usePaymentsData'
import { useSubscribersData } from '../hooks/useSubscribersData'
import type { PaymentFilters, PaymentMethod, PaymentStatus } from '../types/payment'
import type { Subscriber } from '../types/subscriber'
import { formatDate } from '../utils/subscriberFormat'

const paymentMethods: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer']
const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending']

export function PaymentsPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<PaymentFilters>({
    ...defaultPaymentFilters,
    endDate: searchParams.get('endDate') ?? undefined,
    paymentMethod: searchParams.get('paymentMethod') as PaymentMethod | null ?? undefined,
    search: searchParams.get('search') ?? undefined,
    startDate: searchParams.get('startDate') ?? undefined,
  })
  const [demoKey, setDemoKey] = useState(0)
  const [renewalSubscriber, setRenewalSubscriber] = useState<Subscriber | null>(null)
  const { data, isError, isLoading } = usePaymentsData(filters)
  const { data: subscriberData } = useSubscribersData({ limit: 100, page: 1, sortBy: 'createdAt', sortOrder: 'desc' })
  const deleteMutation = useDeletePayment()
  const payments = data?.payments ?? []
  const meta = data?.meta
  const currentPage = meta?.page ?? filters.page
  const totalPages = meta?.pages ?? 1

  const updateFilters = (nextFilters: PaymentFilters) => {
    setFilters(nextFilters)
  }

  const openDemoRenewal = () => {
    const subscribers = subscriberData?.subscribers ?? []

    if (subscribers.length === 0) {
      toast.error('Add a subscriber before generating a demo payment')
      return
    }

    setDemoKey((value) => value + 1)
    setRenewalSubscriber(subscribers[Math.floor(Math.random() * subscribers.length)])
  }

  return (
    <PageWrapper className="flex-1 p-container-padding">
      <div className="space-y-gutter">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-on-background">Payments & Renewals</h2>
            <p className="text-sm text-on-surface-variant">Record offline payments, renew subscriptions, and review collection history.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="h-9 px-4 text-xs font-bold uppercase" icon="auto_fix_high" onClick={openDemoRenewal} variant="secondary">
              Generate Demo Payment
            </Button>
            <p className="text-[10px] text-on-surface-variant">Demo helper - optional. Keep it if useful, remove anytime.</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <label className="text-[10px] font-bold text-outline uppercase xl:col-span-2">
            Search
            <input
              className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm text-on-surface"
              onChange={(event) => updateFilters({ ...filters, page: 1, search: event.target.value || undefined })}
              placeholder="Subscriber name, ID, reference"
              type="search"
              value={filters.search ?? ''}
            />
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Method
            <select
              className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm text-on-surface"
              onChange={(event) => updateFilters({ ...filters, page: 1, paymentMethod: event.target.value as PaymentMethod || undefined })}
              value={filters.paymentMethod ?? ''}
            >
              <option value="">All</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Status
            <select
              className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm text-on-surface"
              onChange={(event) => updateFilters({ ...filters, page: 1, paymentStatus: event.target.value as PaymentStatus || undefined })}
              value={filters.paymentStatus ?? ''}
            >
              <option value="">All</option>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Month
            <input
              className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm text-on-surface"
              max="12"
              min="1"
              onChange={(event) => updateFilters({ ...filters, month: event.target.value ? Number(event.target.value) : undefined, page: 1 })}
              type="number"
              value={filters.month ?? ''}
            />
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Year
            <input
              className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm text-on-surface"
              min="2000"
              onChange={(event) => updateFilters({ ...filters, page: 1, year: event.target.value ? Number(event.target.value) : undefined })}
              type="number"
              value={filters.year ?? ''}
            />
          </label>
        </div>

        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Subscriber</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Previous Expiry</th>
                  <th className="p-3">New Expiry</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Recorded By</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {isLoading && (
                  <tr>
                    <td className="p-6 text-center text-on-surface-variant" colSpan={11}>Loading payments...</td>
                  </tr>
                )}
                {!isLoading && isError && (
                  <tr>
                    <td className="p-6 text-center text-on-surface-variant" colSpan={11}>Unable to load payments.</td>
                  </tr>
                )}
                {!isLoading && !isError && payments.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-on-surface-variant" colSpan={11}>No payment records found.</td>
                  </tr>
                )}
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-3">{formatDate(payment.paymentDate)}</td>
                    <td className="p-3">
                      <div className="font-bold text-on-background">{payment.subscriber.fullName}</div>
                      <div className="font-mono text-[10px] text-outline">{payment.subscriber.subscriberId}</div>
                    </td>
                    <td className="p-3 font-bold">₹{payment.amount.toLocaleString()}</td>
                    <td className="p-3">{payment.paymentMethod}</td>
                    <td className="p-3">{payment.durationMonths} Month{payment.durationMonths > 1 ? 's' : ''}</td>
                    <td className="p-3">{formatDate(payment.previousExpiryDate)}</td>
                    <td className="p-3">{formatDate(payment.newExpiryDate)}</td>
                    <td className="p-3">{payment.paymentStatus}</td>
                    <td className="p-3">{payment.recorder.email}</td>
                    <td className="p-3">{payment.transactionReference || '-'}</td>
                    <td className="p-3 text-right">
                      <Button
                        className="h-8 px-3 text-[10px] font-bold uppercase"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          deleteMutation.mutate(payment.id, {
                            onError: () => toast.error('Only Admin can delete payment records'),
                            onSuccess: () => toast.success('Payment deleted'),
                          })
                        }}
                        variant="ghost"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-surface border-t border-outline-variant px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">Showing <span className="font-bold">{payments.length}</span> of <span className="font-bold">{meta?.total ?? payments.length}</span> payments</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container-low disabled:opacity-50" disabled={currentPage <= 1} onClick={() => updateFilters({ ...filters, page: currentPage - 1 })} type="button">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs" type="button">{currentPage}</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container-low disabled:opacity-50" disabled={currentPage >= totalPages} onClick={() => updateFilters({ ...filters, page: currentPage + 1 })} type="button">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <RenewalModal
        autoFillOnOpen
        isOpen={renewalSubscriber !== null}
        key={`${renewalSubscriber?.id ?? 'none'}-${demoKey}`}
        onClose={() => setRenewalSubscriber(null)}
        subscriber={renewalSubscriber}
      />
    </PageWrapper>
  )
}
