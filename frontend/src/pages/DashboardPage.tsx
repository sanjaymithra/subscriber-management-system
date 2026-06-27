import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { StatCard } from '../components/ui/StatCard'
import { createDashboardCards, emptySubscriberStats } from '../features/dashboard/dashboardData'
import { useComingSoon } from '../hooks/useComingSoon'
import { useDashboardData } from '../hooks/useDashboardData'

function MonthlyRevenueChart({ points }: { points: NonNullable<typeof emptySubscriberStats.monthlyRevenue> }) {
  const hasRevenue = points.some((point) => point.revenue > 0)
  const maxRevenue = Math.max(1, ...points.map((point) => point.revenue))

  if (!hasRevenue) {
    return (
      <div className="p-6 h-64 flex items-center justify-center text-center">
        <p className="max-w-sm text-sm text-on-surface-variant">
          No payment data available yet. Record payments to see monthly revenue trends.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="p-6 h-64 flex items-end gap-2 justify-between">
        <div aria-label="Monthly revenue chart" className="w-full h-full flex items-end gap-3" role="img">
          {points.map((point) => (
            <div className="flex-1 h-full flex flex-col justify-end gap-2 min-w-0" key={`${point.year}-${point.month}`}>
              <div
                className="w-full bg-primary rounded-t-sm min-h-1"
                style={{ height: `${Math.max(4, (point.revenue / maxRevenue) * 100)}%` }}
                title={`${point.label}: ₹${point.revenue.toLocaleString()}`}
              ></div>
              <span className="sr-only">{point.label}: ₹{point.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 bg-surface-container-low flex justify-between gap-2 text-[10px] font-bold text-on-surface-variant">
        {points.map((point) => (
          <span className="truncate" key={`${point.year}-${point.month}`}>{point.label}</span>
        ))}
      </div>
    </>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { showComingSoon } = useComingSoon()
  const { data } = useDashboardData()
  const dashboardData = data ?? {
    cards: createDashboardCards(emptySubscriberStats),
    stats: emptySubscriberStats,
  }

  const openDashboardCard = (filter: string) => {
    if (['paymentMonth', 'paymentToday', 'renewalsToday', 'totalRevenue'].includes(filter)) {
      navigate('/payments')
      return
    }

    const params = new URLSearchParams()

    if (filter === 'active') {
      params.set('status', 'Active')
    } else if (filter === 'pending') {
      params.set('status', 'Pending')
    } else if (filter === 'expired') {
      params.set('status', 'Expired')
    } else if (filter === 'expiringSoon') {
      params.set('expiringSoon', 'true')
    }

    navigate(`/subscribers${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <>
      <PageWrapper className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {dashboardData.cards.map((card) => (
            <StatCard
              icon={card.icon}
              iconClassName={card.iconClassName}
              key={card.label}
              label={card.label}
              onClick={() => openDashboardCard(card.filter)}
              trend={card.trend}
              trendClassName={card.trendClassName}
              value={card.value}
            />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant flex flex-col">
            <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center">
              <h2 className="text-lg font-bold">Monthly Revenue</h2>
              <div className="flex gap-2">
                <button className="text-[10px] bg-secondary-container px-2 py-1 font-bold rounded uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" type="button">
                  Revenue
                </button>
              </div>
            </div>
            <MonthlyRevenueChart points={dashboardData.stats.monthlyRevenue ?? []} />
          </div>
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant flex flex-col">
            <div className="px-4 py-3 border-b border-outline-variant">
              <h2 className="text-lg font-bold">Recent Activity</h2>
            </div>
            <div className="flex-1 overflow-y-auto max-h-64 custom-scrollbar">
              <div className="divide-y divide-outline-variant">
                <div className="px-4 py-3 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded bg-secondary-container/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary !text-lg" aria-hidden="true">
                      database
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Subscriber database connected</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{dashboardData.stats.totalSubscribers.toLocaleString()} records available</p>
                    <p className="text-[10px] text-outline mt-0.5">Live database statistics</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="p-2 text-primary font-bold text-[10px] hover:underline mt-auto border-t border-outline-variant uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => showComingSoon('Activity Timeline')} type="button">
              View All Activity
            </button>
          </div>
        </div>
      </PageWrapper>
      <footer className="h-8 border-t border-outline-variant bg-surface-container-low flex items-center px-container-padding justify-between text-[10px] text-on-surface-variant">
        <div className="flex gap-4">
          <span>SYSTEM STATUS: <span className="text-green-600 font-bold">OPTIMAL</span></span>
          <span>SYNC: 4s AGO</span>
        </div>
        <div className="flex gap-4 uppercase font-bold">
          <span>v4.2.0-STABLE</span>
          <span>© 2024 Telangana Today</span>
        </div>
      </footer>
    </>
  )
}
