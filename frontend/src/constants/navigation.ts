import type { NavItem } from '../types/navigation'

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/subscribers', label: 'Subscribers', icon: 'group' },
  { path: '/payments', label: 'Payments & Renewals', icon: 'payments' },
  { path: '/reports', label: 'Reports', icon: 'assessment' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
  { path: '/help', label: 'Help Center', icon: 'help_outline' },
  { path: '/support', label: 'Support', icon: 'support_agent' },
]
