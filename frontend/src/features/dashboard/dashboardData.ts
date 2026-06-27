import type { DashboardCard } from '../../types/dashboard'
import type { SubscriberStats } from '../../types/subscriber'

export const emptySubscriberStats: SubscriberStats = {
  activeSubscribers: 0,
  expiredSubscribers: 0,
  expiringSoon: 0,
  monthlyRevenue: [],
  pendingSubscribers: 0,
  totalSubscribers: 0,
}

export function createDashboardCards(stats: SubscriberStats): DashboardCard[] {
  const paymentStats = stats.paymentStats ?? {
    renewalsToday: 0,
    thisMonthCollection: 0,
    todayCollection: 0,
    totalRevenue: 0,
  }

  return [
    {
      filter: 'total',
      label: 'TOTAL SUBSCRIBERS',
      value: stats.totalSubscribers.toLocaleString(),
      trend: 'Database records',
      icon: 'group',
      iconClassName: 'text-primary',
      trendClassName: 'text-primary',
    },
    {
      filter: 'active',
      label: 'ACTIVE SUBS',
      value: stats.activeSubscribers.toLocaleString(),
      trend: 'Currently active',
      icon: 'check_circle',
      iconClassName: 'text-green-600',
      trendClassName: 'text-green-600',
    },
    {
      filter: 'expired',
      label: 'EXPIRED SUBS',
      value: stats.expiredSubscribers.toLocaleString(),
      trend: 'Needs renewal',
      icon: 'cancel',
      iconClassName: 'text-error',
      trendClassName: 'text-error',
    },
    {
      filter: 'expiringSoon',
      label: 'EXPIRING SOON',
      value: stats.expiringSoon.toLocaleString(),
      trend: 'Next 30 days',
      icon: 'timer',
      iconClassName: 'text-tertiary',
      trendClassName: 'text-tertiary',
    },
    {
      filter: 'paymentToday',
      label: "TODAY'S COLLECTION",
      value: `₹${paymentStats.todayCollection.toLocaleString()}`,
      trend: 'Paid payments today',
      icon: 'payments',
      iconClassName: 'text-primary',
      trendClassName: 'text-primary',
    },
    {
      filter: 'paymentMonth',
      label: "THIS MONTH'S COLLECTION",
      value: `₹${paymentStats.thisMonthCollection.toLocaleString()}`,
      trend: 'Paid payments this month',
      icon: 'calendar_month',
      iconClassName: 'text-green-600',
      trendClassName: 'text-green-600',
    },
    {
      filter: 'totalRevenue',
      label: 'TOTAL REVENUE',
      value: `₹${paymentStats.totalRevenue.toLocaleString()}`,
      trend: 'All paid records',
      icon: 'account_balance_wallet',
      iconClassName: 'text-tertiary',
      trendClassName: 'text-tertiary',
    },
    {
      filter: 'renewalsToday',
      label: 'RENEWALS TODAY',
      value: paymentStats.renewalsToday.toLocaleString(),
      trend: 'Payment records today',
      icon: 'autorenew',
      iconClassName: 'text-primary',
      trendClassName: 'text-primary',
    },
  ]
}
