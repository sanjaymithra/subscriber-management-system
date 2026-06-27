import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { defaultReportFilters, useReportsData } from '../hooks/useReportsData'
import type { ChartPoint, ReportCard, ReportFilters } from '../types/report'
import { formatDate } from '../utils/subscriberFormat'

function formatValue(card: ReportCard) {
  if (card.valueType === 'currency') {
    return `₹${Math.round(card.value).toLocaleString()}`
  }

  return card.value.toLocaleString()
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString()}`
}

function BarChart({ ariaLabel, points }: { ariaLabel: string; points: ChartPoint[] }) {
  const max = Math.max(1, ...points.map((point) => point.value))

  return (
    <div aria-label={ariaLabel} className="flex items-end justify-between gap-3 h-44 px-1" role="img">
      {points.map((point) => (
        <div className="flex-1 flex flex-col justify-end gap-2 h-full" key={point.label}>
          <div className="w-full bg-primary rounded-t-sm min-h-1" style={{ height: `${Math.max(4, (point.value / max) * 100)}%` }}></div>
          <span className="text-[9px] text-center font-bold text-outline uppercase">{point.label}</span>
        </div>
      ))}
    </div>
  )
}

function DistributionChart({ points }: { points: ChartPoint[] }) {
  const total = Math.max(1, points.reduce((sum, point) => sum + point.value, 0))

  return (
    <div className="space-y-3">
      {points.map((point, index) => (
        <div key={point.label}>
          <div className="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
            <span>{point.label}</span>
            <span>{point.value}</span>
          </div>
          <div className="mt-1 h-2 bg-surface-container-low rounded overflow-hidden">
            <div
              className={index === 0 ? 'h-full bg-primary' : index === 1 ? 'h-full bg-secondary-container' : 'h-full bg-tertiary'}
              style={{ width: `${(point.value / total) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ReportsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ReportFilters>(defaultReportFilters)
  const { data, isError, isLoading } = useReportsData(filters)

  const updateFilters = (nextFilters: Partial<ReportFilters>) => {
    setFilters((current) => ({ ...current, ...nextFilters }))
  }

  const openCard = (card: ReportCard) => {
    const today = new Date().toISOString().slice(0, 10)
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

    if (card.key === 'activeSubscribers') {
      navigate('/subscribers?status=Active')
    } else if (card.key === 'pendingSubscribers') {
      navigate('/subscribers?status=Pending')
    } else if (card.key === 'expiredSubscribers') {
      navigate('/subscribers?status=Expired')
    } else if (card.key === 'expiringSoon') {
      navigate('/subscribers?expiringSoon=true')
    } else if (card.key === 'totalSubscribers') {
      navigate('/subscribers')
    } else if (card.key === 'todayRevenue') {
      navigate(`/payments?startDate=${today}&endDate=${today}`)
    } else if (card.key === 'monthRevenue' || card.key === 'renewalsThisMonth') {
      navigate(`/payments?startDate=${monthStart}&endDate=${today}`)
    } else {
      navigate('/payments')
    }
  }

  return (
    <>
      <PageWrapper className="p-container-padding space-y-gutter">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Reports & Analytics</h2>
            <p className="text-sm text-on-surface-variant">Operational reports from subscriber and payment records.</p>
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <label className="text-[10px] font-bold text-outline uppercase">
            Date Range
            <select className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" onChange={(event) => updateFilters({ datePreset: event.target.value as ReportFilters['datePreset'] })} value={filters.datePreset}>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Start Date
            <input className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" disabled={filters.datePreset !== 'custom'} onChange={(event) => updateFilters({ startDate: event.target.value || undefined })} type="date" value={filters.startDate ?? ''} />
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            End Date
            <input className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" disabled={filters.datePreset !== 'custom'} onChange={(event) => updateFilters({ endDate: event.target.value || undefined })} type="date" value={filters.endDate ?? ''} />
          </label>
          <label className="text-[10px] font-bold text-outline uppercase xl:col-span-2">
            Search
            <input className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" onChange={(event) => updateFilters({ search: event.target.value || undefined })} placeholder="Subscriber name, ID, reference" type="search" value={filters.search ?? ''} />
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Status
            <select className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" onChange={(event) => updateFilters({ status: event.target.value || undefined })} value={filters.status ?? ''}>
              <option value="">All</option>
              {data?.filters.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Plan
            <select className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" onChange={(event) => updateFilters({ plan: event.target.value || undefined })} value={filters.plan ?? ''}>
              <option value="">All</option>
              {data?.filters.plans.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Payment Method
            <select className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" onChange={(event) => updateFilters({ paymentMethod: event.target.value || undefined })} value={filters.paymentMethod ?? ''}>
              <option value="">All</option>
              {data?.filters.paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-bold text-outline uppercase">
            Staff Member
            <select className="mt-1 w-full bg-surface-container-low border border-outline-variant px-3 py-2 text-sm" onChange={(event) => updateFilters({ staffMember: event.target.value || undefined })} value={filters.staffMember ?? ''}>
              <option value="">All</option>
              {data?.filters.staffMembers.map((member) => <option key={member} value={member}>{member}</option>)}
            </select>
          </label>
        </section>

        {isLoading && <div className="bg-white border border-outline-variant p-6 text-sm text-on-surface-variant">Loading reports...</div>}
        {isError && <div className="bg-white border border-outline-variant p-6 text-sm text-on-surface-variant">Unable to load reports.</div>}

        {data && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-gutter">
              {data.cards.map((card) => (
                <button key={card.key} className="bg-white border border-outline-variant p-stack-md text-left hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => openCard(card)} type="button">
                  <span className="text-[10px] font-bold text-outline uppercase">{card.label}</span>
                  <span className="block text-xl font-bold text-on-surface mt-1">{formatValue(card)}</span>
                </button>
              ))}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-gutter">
              <div className="bg-white border border-outline-variant p-stack-md">
                <span className="text-[10px] font-bold text-outline uppercase">Most Popular Plan</span>
                <p className="mt-1 font-bold text-on-surface">{data.quickStats.mostPopularPlan}</p>
              </div>
              <div className="bg-white border border-outline-variant p-stack-md">
                <span className="text-[10px] font-bold text-outline uppercase">Total Payment Records</span>
                <p className="mt-1 font-bold text-on-surface">{data.quickStats.totalPaymentRecords.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-outline-variant p-stack-md">
                <span className="text-[10px] font-bold text-outline uppercase">Average Subscription Value</span>
                <p className="mt-1 font-bold text-on-surface">{formatCurrency(data.quickStats.averageSubscriptionValue)}</p>
              </div>
              <div className="bg-white border border-outline-variant p-stack-md">
                <span className="text-[10px] font-bold text-outline uppercase">Most Used Payment Method</span>
                <p className="mt-1 font-bold text-on-surface">{data.quickStats.mostUsedPaymentMethod}</p>
              </div>
              <div className="bg-white border border-outline-variant p-stack-md">
                <span className="text-[10px] font-bold text-outline uppercase">Total Active Revenue</span>
                <p className="mt-1 font-bold text-on-surface">{formatCurrency(data.quickStats.totalActiveRevenue)}</p>
              </div>
            </section>

            <section className="grid grid-cols-12 gap-gutter">
              <div className="col-span-12 lg:col-span-6 bg-white border border-outline-variant p-stack-md">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Revenue by Month</h3>
                <BarChart ariaLabel="Revenue by month chart" points={data.charts.revenueByMonth} />
              </div>
              <div className="col-span-12 lg:col-span-6 bg-white border border-outline-variant p-stack-md">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Renewals by Month</h3>
                <BarChart ariaLabel="Renewals by month chart" points={data.charts.renewalsByMonth} />
              </div>
              <div className="col-span-12 lg:col-span-6 bg-white border border-outline-variant p-stack-md">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Subscriber Status Distribution</h3>
                <DistributionChart points={data.charts.subscriberStatusDistribution} />
              </div>
              <div className="col-span-12 lg:col-span-6 bg-white border border-outline-variant p-stack-md">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Payment Method Distribution</h3>
                <DistributionChart points={data.charts.paymentMethodDistribution} />
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
              <div className="bg-white border border-outline-variant overflow-hidden">
                <div className="px-4 py-3 border-b border-outline-variant flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Revenue Report</h3>
                  <div className="flex gap-2">
                    <button className="text-[10px] font-bold text-primary uppercase" onClick={() => updateFilters({ revenueSortBy: 'date', revenueSortOrder: filters.revenueSortBy === 'date' && filters.revenueSortOrder === 'desc' ? 'asc' : 'desc' })} type="button">Date</button>
                    <button className="text-[10px] font-bold text-primary uppercase" onClick={() => updateFilters({ revenueSortBy: 'amount', revenueSortOrder: filters.revenueSortBy === 'amount' && filters.revenueSortOrder === 'desc' ? 'asc' : 'desc' })} type="button">Amount</button>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-[10px] font-bold text-outline uppercase">
                      <tr><th className="p-3">Date</th><th className="p-3">Subscriber</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Staff</th></tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-xs">
                      {data.revenueRows.map((row) => (
                        <tr key={`${row.subscriberId}-${row.date}-${row.transactionReference ?? ''}`}>
                          <td className="p-3">{formatDate(row.date)}</td>
                          <td className="p-3"><span className="font-bold">{row.subscriberName}</span><span className="block font-mono text-[10px] text-outline">{row.subscriberId}</span></td>
                          <td className="p-3 font-bold">{formatCurrency(row.amount)}</td>
                          <td className="p-3">{row.paymentMethod}</td>
                          <td className="p-3">{row.staffMember}</td>
                        </tr>
                      ))}
                      {data.revenueRows.length === 0 && <tr><td className="p-4 text-center text-on-surface-variant" colSpan={5}>No revenue records found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-outline-variant overflow-hidden">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <h3 className="font-bold text-sm uppercase tracking-wider">Subscriber Report</h3>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-[10px] font-bold text-outline uppercase">
                      <tr><th className="p-3">Subscriber</th><th className="p-3">Plan</th><th className="p-3">Status</th><th className="p-3">Expiry</th><th className="p-3">Last Payment</th></tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 text-xs">
                      {data.subscriberRows.map((row) => (
                        <tr key={row.subscriberId}>
                          <td className="p-3"><span className="font-bold">{row.subscriberName}</span><span className="block font-mono text-[10px] text-outline">{row.subscriberId}</span></td>
                          <td className="p-3">{row.plan}</td>
                          <td className="p-3">{row.status}</td>
                          <td className="p-3">{formatDate(row.expiryDate)}</td>
                          <td className="p-3">{row.lastPayment ? formatDate(row.lastPayment) : '-'}</td>
                        </tr>
                      ))}
                      {data.subscriberRows.length === 0 && <tr><td className="p-4 text-center text-on-surface-variant" colSpan={5}>No subscribers found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </PageWrapper>
    </>
  )
}
