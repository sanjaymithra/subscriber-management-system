export type DashboardCard = {
  filter: 'active' | 'expired' | 'expiringSoon' | 'paymentMonth' | 'paymentToday' | 'pending' | 'renewalsToday' | 'total' | 'totalRevenue'
  icon: string
  iconClassName: string
  label: string
  trend: string
  trendClassName: string
  value: string
}

export type RecentActivity = {
  badgeClassName: string
  desc: string
  icon: string
  iconClassName: string
  time: string
  title: string
}
