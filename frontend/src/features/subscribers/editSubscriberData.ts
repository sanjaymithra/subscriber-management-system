import type { SubscriptionPlan } from '../../types/subscriber'

export const subscriptionPlans: SubscriptionPlan[] = [
  { name: 'Premium Print', price: '₹4,999/yr', icon: 'news', active: false },
  { name: 'Digital Only', price: '₹1,299/yr', icon: 'tablet_android', active: false },
  { name: 'Weekend Only', price: '₹1,999/yr', icon: 'weekend', active: false },
]
