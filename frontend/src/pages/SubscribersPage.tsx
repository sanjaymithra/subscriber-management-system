import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { SelectInput } from '../components/ui/FormField'
import { useComingSoon } from '../hooks/useComingSoon'
import { SubscriberTable } from '../features/subscribers/SubscriberTable'
import { newspaperTypes, subscriptionStatuses } from '../features/subscribers/subscribersData'
import { defaultSubscriberFilters, useSubscribersData } from '../hooks/useSubscribersData'
import type { SubscriberFilters } from '../types/subscriber'

export function SubscribersPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showComingSoon } = useComingSoon()
  const [filters, setFilters] = useState<SubscriberFilters>(() => ({
    ...defaultSubscriberFilters,
    expiringSoon: searchParams.get('expiringSoon') === 'true' || undefined,
    subscriptionStatus: searchParams.get('status') ?? undefined,
  }))
  const { data, isError, isLoading } = useSubscribersData(filters)
  const activeDashboardFilter = filters.expiringSoon ? 'Expiring Soon' : filters.subscriptionStatus

  useEffect(() => {
    if (isError) {
      toast.error('Unable to connect to the server.')
    }
  }, [isError])

  const updateFilters = (nextFilters: SubscriberFilters) => {
    setFilters(nextFilters)
  }

  return (
    <PageWrapper className="p-6 flex-grow">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase mb-1">
            <span>Main</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary">Subscribers</span>
          </nav>
          <h2 className="text-2xl font-bold text-on-background">Subscriber Management</h2>
          <p className="text-sm text-on-surface-variant">
            Manage and track all active and pending physical/digital subscriptions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="h-9 px-4 text-xs font-bold uppercase"
            icon="file_download"
            onClick={() => showComingSoon('CSV Export')}
            variant="outline"
          >
            Export CSV
          </Button>
          <Button
            className="h-9 px-4 text-xs font-bold uppercase"
            icon="person_add"
            onClick={() => navigate('/subscribers/new')}
          >
            Add Subscriber
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant p-3 flex flex-wrap items-center gap-3 mb-4 rounded-lg">
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-[10px] font-bold text-outline uppercase px-1" htmlFor="subscriber-search">Search</label>
          <input
            className="h-8 bg-background border border-outline-variant rounded text-xs px-2 focus:ring-1 focus:ring-primary focus:outline-none"
            id="subscriber-search"
            onChange={(event) => updateFilters({ ...filters, page: 1, search: event.target.value || undefined })}
            placeholder="ID, name, phone, email"
            type="search"
            value={filters.search ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-outline uppercase px-1" htmlFor="filter-status">Status</label>
          <SelectInput
            id="filter-status"
            onChange={(event) => updateFilters({ ...filters, page: 1, subscriptionStatus: event.target.value || undefined })}
            value={filters.subscriptionStatus ?? ''}
          >
            <option value="">All Statuses</option>
            {subscriptionStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </SelectInput>
        </div>
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-outline uppercase px-1" htmlFor="filter-plan">Plan Type</label>
          <SelectInput
            id="filter-plan"
            onChange={(event) => updateFilters({ ...filters, page: 1, subscriptionPlan: event.target.value || undefined })}
            value={filters.subscriptionPlan ?? ''}
          >
            <option value="">All Plans</option>
            <option value="Premium Print">Premium Print</option>
            <option value="Digital Only">Digital Only</option>
            <option value="Weekend Only">Weekend Only</option>
          </SelectInput>
        </div>
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[10px] font-bold text-outline uppercase px-1" htmlFor="filter-newspaper">Newspaper Type</label>
          <SelectInput
            id="filter-newspaper"
            onChange={(event) => updateFilters({ ...filters, page: 1, newspaperType: event.target.value || undefined })}
            value={filters.newspaperType ?? ''}
          >
            <option value="">All Types</option>
            {newspaperTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </SelectInput>
        </div>
        <Button
          className="mt-auto h-8 px-3 border-primary/20 text-xs font-bold uppercase"
          icon="filter_list"
          onClick={() => showComingSoon('Advanced Filters')}
          variant="outline"
        >
          Filters
        </Button>
        <button
          className="mt-auto h-8 px-3 text-outline hover:text-error rounded text-xs font-bold transition-colors uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => updateFilters(defaultSubscriberFilters)}
          type="button"
        >
          Clear All
        </button>
        {activeDashboardFilter && (
          <span className="mt-auto h-8 inline-flex items-center px-3 text-[10px] font-bold uppercase text-primary bg-secondary-container/30 border border-primary/20 rounded">
            Active Filter: {activeDashboardFilter}
          </span>
        )}
      </div>

      <SubscriberTable
        errorMessage={isError ? 'Unable to connect to the server. Subscriber data is unavailable.' : undefined}
        filters={filters}
        isLoading={isLoading}
        meta={isError ? undefined : data?.meta}
        onFiltersChange={updateFilters}
        subscribers={isError ? [] : data?.subscribers ?? []}
      />
    </PageWrapper>
  )
}
