import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentDemoUser } from '../../api/authApi'
import { getPayments } from '../../api/paymentApi'
import { getSubscribers } from '../../api/subscriberApi'
import { useDashboardData } from '../../hooks/useDashboardData'
import { defaultPaymentFilters, usePaymentsData } from '../../hooks/usePaymentsData'
import { useSubscribersData } from '../../hooks/useSubscribersData'
import { formatDate } from '../../utils/subscriberFormat'
import { IconButton } from '../ui/IconButton'

type NavbarProps = {
  onMenuClick?: () => void
  title?: string
}

type SearchResult = {
  description: string
  icon: string
  label: string
  path: string
}

function getDaysUntil(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

export function Navbar({ onMenuClick, title = 'Portal' }: NavbarProps) {
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement | null>(null)
  const user = getCurrentDemoUser()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { data: dashboardData } = useDashboardData()
  const { data: expiringData } = useSubscribersData({ expiringSoon: true, limit: 3, page: 1, sortBy: 'expiryDate', sortOrder: 'asc' })
  const { data: latestPayments } = usePaymentsData(defaultPaymentFilters)
  const { data: latestSubscribers } = useSubscribersData({ limit: 2, page: 1, sortBy: 'createdAt', sortOrder: 'desc' })

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([])
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    const trimmedTerm = searchTerm.trim()

    if (trimmedTerm.length < 2) {
      return
    }

    const timeout = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        const [subscriberResponse, paymentResponse] = await Promise.all([
          getSubscribers({ limit: 5, page: 1, search: trimmedTerm, sortBy: 'createdAt', sortOrder: 'desc' }),
          getPayments({ ...defaultPaymentFilters, limit: 5, search: trimmedTerm }),
        ])
        const demoUsers = [
          { email: 'admin@demo.com', name: 'Admin User', role: 'Admin' },
          { email: 'staff@demo.com', name: 'Staff User', role: 'Staff' },
        ].filter((demoUser) => `${demoUser.name} ${demoUser.email}`.toLowerCase().includes(trimmedTerm.toLowerCase()))

        setResults([
          ...subscriberResponse.subscribers.map((subscriber): SearchResult => ({
            description: `${subscriber.subscriberId} · ${subscriber.phone}`,
            icon: 'person',
            label: subscriber.fullName,
            path: `/subscribers/${subscriber.subscriberId}`,
          })),
          ...paymentResponse.payments.map((payment): SearchResult => ({
            description: `${payment.transactionReference ?? 'Payment'} · ₹${payment.amount.toLocaleString()}`,
            icon: 'payments',
            label: payment.subscriber.fullName,
            path: '/payments',
          })),
          ...demoUsers.map((demoUser): SearchResult => ({
            description: `${demoUser.email} · ${demoUser.role}`,
            icon: 'account_circle',
            label: demoUser.name,
            path: '/profile',
          })),
        ])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  const notifications = useMemo(() => {
    const items: { description: string; icon: string; title: string }[] = []

    for (const subscriber of expiringData?.subscribers ?? []) {
      const days = getDaysUntil(subscriber.expiryDate)
      items.push({
        description: `Expires ${days <= 0 ? 'today' : `in ${days} days`} · ${formatDate(subscriber.expiryDate)}`,
        icon: 'timer',
        title: `Subscriber ${subscriber.fullName} needs renewal attention.`,
      })
    }

    for (const payment of latestPayments?.payments.slice(0, 3) ?? []) {
      items.push({
        description: `${payment.paymentMethod} · ${formatDate(payment.paymentDate)}`,
        icon: 'payments',
        title: `Payment of ₹${payment.amount.toLocaleString()} recorded for ${payment.subscriber.fullName}.`,
      })
    }

    for (const subscriber of latestSubscribers?.subscribers.slice(0, 2) ?? []) {
      items.push({
        description: `Plan: ${subscriber.subscriptionPlan}`,
        icon: 'person_add',
        title: `New subscriber added: ${subscriber.fullName}.`,
      })
    }

    items.push({
      description: `${user.role} session active`,
      icon: 'login',
      title: `${user.role} logged in.`,
    })

    if (dashboardData) {
      items.push({
        description: `${dashboardData.stats.totalSubscribers.toLocaleString()} subscribers tracked`,
        icon: 'monitoring',
        title: 'Dashboard statistics updated.',
      })
    }

    return items
  }, [dashboardData, expiringData?.subscribers, latestPayments?.payments, latestSubscribers?.subscribers, user.role])

  const selectResult = (path: string) => {
    setResults([])
    setSearchTerm('')
    navigate(path)
  }

  return (
    <header aria-label={`${title} navigation`} className="min-h-12 bg-surface border-b border-outline-variant sticky top-0 z-40 flex justify-between items-center gap-3 px-container-padding py-2">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconButton className="h-8 w-8 text-on-surface-variant hover:bg-surface-container-low md:hidden" icon="menu" label="Open navigation" onClick={onMenuClick} />
        <div className="relative w-full max-w-md group hidden sm:block" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary">search</span>
          <label className="sr-only" htmlFor="global-search">Search everything</label>
          <input
            id="global-search"
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search subscribers, payments, users..."
            type="search"
            value={searchTerm}
          />
          {searchTerm.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant shadow-md z-50">
              {isSearching && <p className="p-3 text-xs text-on-surface-variant">Searching...</p>}
              {!isSearching && results.length === 0 && <p className="p-3 text-xs text-on-surface-variant">No matching results found.</p>}
              {!isSearching && results.map((result) => (
                <button className="w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-primary/5" key={`${result.path}-${result.label}-${result.description}`} onClick={() => selectResult(result.path)} type="button">
                  <span className="material-symbols-outlined text-primary !text-lg" aria-hidden="true">{result.icon}</span>
                  <span>
                    <span className="block text-xs font-bold text-on-surface">{result.label}</span>
                    <span className="block text-[10px] text-on-surface-variant">{result.description}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 relative">
          <IconButton className="h-8 w-8 hover:bg-surface-container-low relative text-on-surface-variant" icon="notifications" label="Notifications" onClick={() => setIsNotificationsOpen((value) => !value)}>
            {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>}
          </IconButton>
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant shadow-md z-50">
              <div className="px-3 py-2 border-b border-outline-variant">
                <p className="text-xs font-bold uppercase text-on-surface">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 && <p className="p-3 text-xs text-on-surface-variant">No recent notifications.</p>}
                {notifications.map((notification) => (
                  <div className="px-3 py-2 flex gap-3 border-b border-outline-variant/40" key={`${notification.icon}-${notification.title}-${notification.description}`}>
                    <span className="material-symbols-outlined text-primary !text-lg" aria-hidden="true">{notification.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">{notification.title}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <IconButton className="h-8 w-8 hover:bg-surface-container-low text-on-surface-variant" icon="help_outline" label="Help" onClick={() => navigate('/help')} />
          <button className="text-sm text-primary font-bold px-2 py-1 hover:bg-primary-container/10 rounded transition-colors" onClick={() => navigate('/support')} type="button">Support</button>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant hidden md:block"></div>
        <Link className="flex items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" to="/profile">
          <span className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container flex items-center justify-center text-on-primary text-xs font-bold">{user.role.slice(0, 1)}</span>
          <span className="text-sm font-semibold hidden md:block">{user.role === 'Staff' ? 'Staff User' : 'Admin User'}</span>
        </Link>
      </div>
    </header>
  )
}
