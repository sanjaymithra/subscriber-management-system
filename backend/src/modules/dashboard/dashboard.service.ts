import { DashboardRepository } from './dashboard.repository.js'
import { PaymentService } from '../payments/payments.service.js'
import { SubscriberService } from '../subscribers/subscribers.service.js'

export class DashboardService {
  constructor(
    private readonly dashboardRepository = new DashboardRepository(),
    private readonly paymentService = new PaymentService(),
    private readonly subscriberService = new SubscriberService(),
  ) {}

  async getDashboardStats() {
    void this.dashboardRepository
    const [subscriberStats, paymentStats, monthlyRevenue] = await Promise.all([
      this.subscriberService.getDashboardStats(),
      this.paymentService.getPaymentStats(),
      this.paymentService.getMonthlyRevenue(),
    ])

    return {
      monthlyRevenue,
      ...subscriberStats,
      paymentStats,
    }
  }
}
