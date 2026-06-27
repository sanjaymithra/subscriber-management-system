import type { Subscriber } from '../types/subscriber'

export function formatDate(value: string) {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

export function getStatusClassName(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'expired':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    default:
      return 'bg-secondary-container/30 text-primary border-primary/20'
  }
}

export function getStatusDotClassName(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-600'
    case 'expired':
      return 'bg-red-600'
    case 'pending':
      return 'bg-amber-600'
    default:
      return 'bg-primary'
  }
}

export function getSubscriberRouteId(subscriber: Subscriber) {
  return subscriber.subscriberId
}
