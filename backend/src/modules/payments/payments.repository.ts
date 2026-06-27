import { Prisma } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import type {
  MonthlyRevenuePoint,
  PaymentListQuery,
  PaymentListResult,
  PaymentStats,
  PaymentWithRelations,
  RenewSubscriptionInput,
  UpdatePaymentInput,
} from './payments.types.js'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const paymentInclude = {
  recorder: {
    select: {
      email: true,
      id: true,
      role: true,
    },
  },
  subscriber: {
    select: {
      fullName: true,
      id: true,
      subscriberId: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
    },
  },
} as const satisfies Prisma.PaymentInclude

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

function calculateSubscriptionStatus(startDate: Date, expiryDate: Date) {
  const today = startOfToday()
  const start = new Date(startDate)
  const expiry = new Date(expiryDate)

  start.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)

  if (today < start) {
    return 'Pending'
  }

  if (today > expiry) {
    return 'Expired'
  }

  return 'Active'
}

function getDateRange(query: PaymentListQuery): Prisma.PaymentWhereInput {
  if (query.startDate || query.endDate) {
    const paymentDate: Prisma.DateTimeFilter<'Payment'> = {}

    if (query.startDate) {
      paymentDate.gte = query.startDate
    }

    if (query.endDate) {
      paymentDate.lte = query.endDate
    }

    return {
      paymentDate,
    }
  }

  if (query.month && query.year) {
    const start = new Date(query.year, query.month - 1, 1)
    const end = new Date(query.year, query.month, 0, 23, 59, 59, 999)

    return {
      paymentDate: {
        gte: start,
        lte: end,
      },
    }
  }

  if (query.year) {
    return {
      paymentDate: {
        gte: new Date(query.year, 0, 1),
        lte: new Date(query.year, 11, 31, 23, 59, 59, 999),
      },
    }
  }

  return {}
}

function buildWhere(query: PaymentListQuery): Prisma.PaymentWhereInput {
  const filters: Prisma.PaymentWhereInput[] = []

  if (query.search) {
    filters.push({
      OR: [
        { transactionReference: { contains: query.search, mode: 'insensitive' } },
        { subscriber: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { subscriber: { subscriberId: { contains: query.search, mode: 'insensitive' } } },
      ],
    })
  }

  if (query.paymentMethod) {
    filters.push({ paymentMethod: query.paymentMethod })
  }

  if (query.paymentStatus) {
    filters.push({ paymentStatus: query.paymentStatus })
  }

  const dateRange = getDateRange(query)
  if (Object.keys(dateRange).length > 0) {
    filters.push(dateRange)
  }

  return filters.length > 0 ? { AND: filters } : {}
}

function toPaymentDto(payment: PaymentWithRelations) {
  return {
    ...payment,
    amount: Number(payment.amount),
  }
}

export class PaymentRepository {
  async delete(id: string) {
    const payment = await prisma.payment.delete({
      include: paymentInclude,
      where: { id },
    })

    return toPaymentDto(payment)
  }

  async findMany(query: PaymentListQuery): Promise<PaymentListResult> {
    const where = buildWhere(query)
    const skip = (query.page - 1) * query.limit

    const [payments, total] = await prisma.$transaction([
      prisma.payment.findMany({
        include: paymentInclude,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
        where,
      }),
      prisma.payment.count({ where }),
    ])

    return {
      payments: payments.map(toPaymentDto),
      total,
    }
  }

  async findBySubscriberId(subscriberIdentifier: string) {
    const payments = await prisma.payment.findMany({
      include: paymentInclude,
      orderBy: { paymentDate: 'desc' },
      where: {
        subscriber: {
          OR: [
            { id: subscriberIdentifier },
            { subscriberId: subscriberIdentifier },
          ],
        },
      },
    })

    return payments.map(toPaymentDto)
  }

  async getStats(): Promise<PaymentStats> {
    const today = startOfToday()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    const [todayCollection, thisMonthCollection, totalRevenue, renewalsToday] = await prisma.$transaction([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          paymentDate: { gte: today, lt: tomorrow },
          paymentStatus: 'Paid',
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          paymentDate: { gte: monthStart, lt: nextMonth },
          paymentStatus: 'Paid',
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'Paid' },
      }),
      prisma.payment.count({
        where: {
          paymentDate: { gte: today, lt: tomorrow },
        },
      }),
    ])

    return {
      renewalsToday,
      thisMonthCollection: Number(thisMonthCollection._sum.amount ?? 0),
      todayCollection: Number(todayCollection._sum.amount ?? 0),
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    }
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenuePoint[]> {
    const payments = await prisma.payment.findMany({
      select: {
        amount: true,
        paymentDate: true,
      },
      where: { paymentStatus: 'Paid' },
    })

    const monthlyRevenue = new Map<string, MonthlyRevenuePoint>()

    for (const payment of payments) {
      const year = payment.paymentDate.getFullYear()
      const month = payment.paymentDate.getMonth() + 1
      const key = `${year}-${String(month).padStart(2, '0')}`
      const existingPoint = monthlyRevenue.get(key)

      if (existingPoint) {
        existingPoint.revenue += Number(payment.amount)
      } else {
        monthlyRevenue.set(key, {
          label: `${monthLabels[month - 1]} ${year}`,
          month,
          revenue: Number(payment.amount),
          year,
        })
      }
    }

    return Array.from(monthlyRevenue.values()).sort((first, second) => {
      if (first.year !== second.year) {
        return first.year - second.year
      }

      return first.month - second.month
    })
  }

  async renewSubscription(input: RenewSubscriptionInput) {
    const today = startOfToday()

    return prisma.$transaction(async (transaction) => {
      const [subscriber, recorder] = await Promise.all([
        transaction.subscriber.findFirst({
          where: {
            OR: [
              { id: input.subscriberId },
              { subscriberId: input.subscriberId },
            ],
          },
        }),
        transaction.user.findUnique({
          where: { email: input.recordedByEmail },
        }),
      ])

      if (!subscriber) {
        throw new Error('SUBSCRIBER_NOT_FOUND')
      }

      if (!recorder) {
        throw new Error('RECORDER_NOT_FOUND')
      }

      const previousExpiryDate = subscriber.expiryDate
      const previousExpiryDay = new Date(previousExpiryDate)
      previousExpiryDay.setHours(0, 0, 0, 0)

      const baseDate = previousExpiryDay < today ? today : previousExpiryDate
      const newExpiryDate = addMonths(baseDate, input.durationMonths)
      const subscriptionStatus = calculateSubscriptionStatus(subscriber.startDate, newExpiryDate)

      const paymentData: Prisma.PaymentUncheckedCreateInput = {
        amount: new Prisma.Decimal(input.amount),
        durationMonths: input.durationMonths,
        newExpiryDate,
        paymentDate: new Date(),
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        previousExpiryDate,
        recordedBy: recorder.id,
        remarks: input.remarks ?? null,
        subscriberId: subscriber.id,
        transactionReference: input.transactionReference ?? null,
      }

      const payment = await transaction.payment.create({
        data: paymentData,
        include: paymentInclude,
      })

      const updatedSubscriber = await transaction.subscriber.update({
        data: {
          expiryDate: newExpiryDate,
          paymentStatus: input.paymentStatus,
          subscriptionStatus,
        },
        where: { id: subscriber.id },
      })

      return {
        payment: toPaymentDto(payment),
        subscriber: {
          ...updatedSubscriber,
          subscriptionStatus,
        },
      }
    })
  }

  async update(id: string, input: UpdatePaymentInput) {
    const data: Prisma.PaymentUpdateInput = {}

    if (input.amount !== undefined) {
      data.amount = new Prisma.Decimal(input.amount)
    }

    if (input.paymentMethod !== undefined) {
      data.paymentMethod = input.paymentMethod
    }

    if (input.paymentStatus !== undefined) {
      data.paymentStatus = input.paymentStatus
    }

    if (input.remarks !== undefined) {
      data.remarks = input.remarks
    }

    if (input.transactionReference !== undefined) {
      data.transactionReference = input.transactionReference
    }

    const payment = await prisma.payment.update({
      data,
      include: paymentInclude,
      where: { id },
    })

    return toPaymentDto(payment)
  }
}
