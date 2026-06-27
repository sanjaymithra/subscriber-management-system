import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../../components/ui/IconButton'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { RenewalModal } from '../payments/RenewalModal'
import type { PaginatedMeta } from '../../types/api'
import type { Subscriber, SubscriberFilters } from '../../types/subscriber'
import { formatDate, getInitials, getStatusClassName, getStatusDotClassName, getSubscriberRouteId } from '../../utils/subscriberFormat'
import { useDeleteSubscriber } from '../../hooks/useSubscribersData'

type SubscriberTableProps = {
  errorMessage?: string
  filters: SubscriberFilters
  isLoading: boolean
  meta?: PaginatedMeta
  onFiltersChange: (filters: SubscriberFilters) => void
  subscribers: Subscriber[]
}

export function SubscriberTable({ errorMessage, filters, isLoading, meta, onFiltersChange, subscribers }: SubscriberTableProps) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteSubscriber()
  const [subscriberToRenew, setSubscriberToRenew] = useState<Subscriber | null>(null)
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null)

  const openSubscriber = (subscriber: Subscriber) => {
    navigate(`/subscribers/${getSubscriberRouteId(subscriber)}`)
  }

  const currentPage = meta?.page ?? filters.page
  const totalPages = meta?.pages ?? 1
  const total = meta?.total ?? subscribers.length
  const start = total === 0 ? 0 : (currentPage - 1) * filters.limit + 1
  const end = Math.min(currentPage * filters.limit, total)

  return (
    <>
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr className="text-[10px] font-bold text-outline uppercase tracking-wider">
              <th className="p-3 w-12"><input aria-label="Select all subscribers" type="checkbox" className="rounded text-primary" /></th>
              <th className="p-3">ID</th>
              <th className="p-3">
                <button
                  className="uppercase"
                  onClick={() => onFiltersChange({
                    ...filters,
                    page: 1,
                    sortBy: 'fullName',
                    sortOrder: filters.sortBy === 'fullName' && filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })}
                  type="button"
                >
                  Subscriber
                </button>
              </th>
              <th className="p-3">Contact</th>
              <th className="p-3">Active Plan</th>
              <th className="p-3">
                <button
                  className="uppercase"
                  onClick={() => onFiltersChange({
                    ...filters,
                    page: 1,
                    sortBy: 'expiryDate',
                    sortOrder: filters.sortBy === 'expiryDate' && filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })}
                  type="button"
                >
                  Renewal
                </button>
              </th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 text-xs">
            {isLoading && (
              <tr>
                <td className="p-6 text-center text-on-surface-variant" colSpan={8}>Loading subscribers...</td>
              </tr>
            )}
            {!isLoading && errorMessage && (
              <tr>
                <td className="p-6 text-center text-on-surface-variant" colSpan={8}>{errorMessage}</td>
              </tr>
            )}
            {!isLoading && !errorMessage && subscribers.length === 0 && (
              <tr>
                <td className="p-6 text-center text-on-surface-variant" colSpan={8}>No subscribers found.</td>
              </tr>
            )}
            {!errorMessage && subscribers.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-primary/5 transition-colors cursor-pointer focus-within:bg-primary/5"
                onClick={() => openSubscriber(row)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    openSubscriber(row)
                  }
                }}
                tabIndex={0}
              >
                <td className="p-3">
                  <input
                    aria-label={`Select ${row.fullName}`}
                    className="rounded text-primary"
                    onClick={(event) => event.stopPropagation()}
                    type="checkbox"
                  />
                </td>
                <td className="p-3 font-mono text-outline">{row.subscriberId}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary text-[10px] font-bold">
                      {getInitials(row.fullName)}
                    </div>
                    <span className="font-bold text-on-background">{row.fullName}</span>
                  </div>
                </td>
                <td className="p-3 text-on-surface-variant">
                  <div>{row.email}</div>
                  <div className="text-[10px] text-outline">{row.phone}</div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-secondary-container/30 text-primary border border-primary/20 rounded text-[10px] font-bold uppercase">
                    {row.subscriptionPlan}
                  </span>
                </td>
                <td className="p-3">{formatDate(row.expiryDate)}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusClassName(row.subscriptionStatus)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotClassName(row.subscriptionStatus)}`}></span>
                    {row.subscriptionStatus}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <IconButton
                      className="h-8 w-8 text-outline hover:text-primary hover:bg-surface-container-low"
                      icon="autorenew"
                      label={`Renew ${row.fullName}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setSubscriberToRenew(row)
                      }}
                    />
                    <IconButton
                      className="h-8 w-8 text-outline hover:text-primary hover:bg-surface-container-low"
                      icon="edit"
                      label={`Edit ${row.fullName}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/subscribers/${getSubscriberRouteId(row)}/edit`)
                      }}
                    />
                    <IconButton
                      className="h-8 w-8 text-outline hover:text-error hover:bg-surface-container-low"
                      icon="delete"
                      label={`Delete ${row.fullName}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setSubscriberToDelete(row)
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-surface border-t border-outline-variant px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">Showing <span className="font-bold">{start}-{end}</span> of <span className="font-bold">{total}</span> subscribers</p>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous page"
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container-low disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => onFiltersChange({ ...filters, page: currentPage - 1 })}
            type="button"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button aria-label={`Page ${currentPage}`} className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs" type="button">{currentPage}</button>
          <button
            aria-label="Next page"
            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container-low disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => onFiltersChange({ ...filters, page: currentPage + 1 })}
            type="button"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
    <RenewalModal
      isOpen={subscriberToRenew !== null}
      onClose={() => setSubscriberToRenew(null)}
      subscriber={subscriberToRenew}
    />
    <Modal
      isOpen={subscriberToDelete !== null}
      onClose={() => setSubscriberToDelete(null)}
      title="Delete Subscriber"
    >
      <p className="text-sm text-on-surface-variant">
        Delete <span className="font-bold text-on-surface">{subscriberToDelete?.fullName}</span>? This action will remove the database record.
      </p>
      <div className="mt-5 flex justify-end gap-3">
        <Button className="px-4 py-2 text-xs font-bold uppercase" onClick={() => setSubscriberToDelete(null)} variant="secondary">
          Cancel
        </Button>
        <Button
          className="px-4 py-2 text-xs font-bold uppercase"
          onClick={() => {
            if (!subscriberToDelete) {
              return
            }

            deleteMutation.mutate(subscriberToDelete.subscriberId, {
              onError: () => toast.error('Failed to delete subscriber'),
              onSuccess: () => {
                toast.success('Subscriber deleted')
                setSubscriberToDelete(null)
              },
            })
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
    </>
  )
}
