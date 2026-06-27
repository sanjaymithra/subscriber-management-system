import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { AppError } from '../../errors/AppError.js'
import { PaymentRepository } from './payments.repository.js'
import type { PaymentListQuery, RenewSubscriptionInput, UpdatePaymentInput } from './payments.types.js'

export class PaymentService {
  constructor(private readonly paymentRepository = new PaymentRepository()) {}

  getModuleStatus() {
    void this.paymentRepository
    return { module: 'payments', status: 'ready' }
  }

  async deletePayment(id: string, recordedByEmail: string) {
    await this.requireAdmin(recordedByEmail)

    return this.paymentRepository.delete(id)
  }

  async getPaymentHistory(subscriberId: string) {
    return this.paymentRepository.findBySubscriberId(subscriberId)
  }

  async getPaymentStats() {
    return this.paymentRepository.getStats()
  }

  async getMonthlyRevenue() {
    return this.paymentRepository.getMonthlyRevenue()
  }

  async listPayments(query: PaymentListQuery) {
    const { payments, total } = await this.paymentRepository.findMany(query)
    const pages = Math.max(1, Math.ceil(total / query.limit))

    return {
      data: payments,
      meta: {
        limit: query.limit,
        page: query.page,
        pages,
        total,
      },
    }
  }

  async renewSubscription(input: RenewSubscriptionInput) {
    await this.requireStaffOrAdmin(input.recordedByEmail)

    try {
      return await this.paymentRepository.renewSubscription(input)
    } catch (error) {
      if (error instanceof Error && error.message === 'SUBSCRIBER_NOT_FOUND') {
        throw new AppError('Subscriber not found', HTTP_STATUS.NOT_FOUND)
      }

      if (error instanceof Error && error.message === 'RECORDER_NOT_FOUND') {
        throw new AppError('Demo user not found', HTTP_STATUS.UNAUTHORIZED)
      }

      throw error
    }
  }

  async updatePayment(id: string, input: UpdatePaymentInput) {
    await this.requireAdmin(input.recordedByEmail)

    return this.paymentRepository.update(id, input)
  }

  private async requireAdmin(recordedByEmail: string) {
    const user = await this.findDemoUser(recordedByEmail)

    if (user.role !== 'Admin') {
      throw new AppError('Admin permission is required', HTTP_STATUS.FORBIDDEN)
    }
  }

  private async requireStaffOrAdmin(recordedByEmail: string) {
    const user = await this.findDemoUser(recordedByEmail)

    if (!['Admin', 'Staff'].includes(user.role)) {
      throw new AppError('Payment permission is required', HTTP_STATUS.FORBIDDEN)
    }
  }

  private async findDemoUser(recordedByEmail: string) {
    try {
      const { prisma } = await import('../../database/prisma.js')
      const user = await prisma.user.findUnique({ where: { email: recordedByEmail } })

      if (!user) {
        throw new AppError('Demo user not found', HTTP_STATUS.UNAUTHORIZED)
      }

      return user
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw error
    }
  }
}
