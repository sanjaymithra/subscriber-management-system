import type { Prisma, Subscriber } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import { createInitialPaymentForSubscriber } from '../payments/initialPayments.js'
import type { CreateSubscriberInput, SubscriberListQuery, SubscriberListResult, UpdateSubscriberInput } from './subscribers.types.js'

function getTodayRange() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  return { thirtyDaysFromNow, today }
}

function getStatusWhere(status: string): Prisma.SubscriberWhereInput {
  const { today } = getTodayRange()

  switch (status.toLowerCase()) {
    case 'active':
      return {
        expiryDate: { gte: today },
        startDate: { lte: today },
      }
    case 'expired':
      return { expiryDate: { lt: today } }
    case 'pending':
      return { startDate: { gt: today } }
    default:
      return {}
  }
}

function getExpiringSoonWhere(): Prisma.SubscriberWhereInput {
  const { thirtyDaysFromNow, today } = getTodayRange()

  return {
    expiryDate: {
      gte: today,
      lte: thirtyDaysFromNow,
    },
  }
}

function buildWhere(query: SubscriberListQuery): Prisma.SubscriberWhereInput {
  const filters: Prisma.SubscriberWhereInput[] = []

  if (query.search) {
    filters.push({
      OR: [
        { subscriberId: { contains: query.search, mode: 'insensitive' } },
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ],
    })
  }

  if (query.subscriptionStatus) {
    filters.push(getStatusWhere(query.subscriptionStatus))
  }

  if (query.expiringSoon) {
    filters.push(getExpiringSoonWhere())
  }

  if (query.newspaperType) {
    filters.push({ newspaperType: { equals: query.newspaperType, mode: 'insensitive' } })
  }

  if (query.subscriptionPlan) {
    filters.push({ subscriptionPlan: { equals: query.subscriptionPlan, mode: 'insensitive' } })
  }

  return filters.length > 0 ? { AND: filters } : {}
}

function calculateSubscriptionStatus(startDate: Date, expiryDate: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  if (today < start) {
    return 'Pending'
  }

  if (today > expiry) {
    return 'Expired'
  }

  return 'Active'
}

function withComputedStatus<TSubscriber extends Subscriber>(subscriber: TSubscriber): TSubscriber {
  return {
    ...subscriber,
    subscriptionStatus: calculateSubscriptionStatus(subscriber.startDate, subscriber.expiryDate),
  }
}

export class SubscriberRepository {
  async count(where: Prisma.SubscriberWhereInput = {}) {
    return prisma.subscriber.count({ where })
  }

  async create(data: CreateSubscriberInput) {
    const subscriber = await prisma.$transaction(async (transaction) => {
      const createdSubscriber = await transaction.subscriber.create({
        data: {
          ...data,
          subscriptionStatus: calculateSubscriptionStatus(data.startDate, data.expiryDate),
        },
      })

      await createInitialPaymentForSubscriber(transaction, createdSubscriber)

      return createdSubscriber
    })

    return withComputedStatus(subscriber)
  }

  async delete(id: string) {
    return prisma.subscriber.delete({ where: { id } })
  }

  async findByIdOrSubscriberId(id: string): Promise<Subscriber | null> {
    const subscriber = await prisma.subscriber.findFirst({
      where: {
        OR: [{ id }, { subscriberId: id }],
      },
    })

    return subscriber ? withComputedStatus(subscriber) : null
  }

  async findMany(query: SubscriberListQuery): Promise<SubscriberListResult> {
    const where = buildWhere(query)
    const skip = (query.page - 1) * query.limit

    const [subscribers, total] = await prisma.$transaction([
      prisma.subscriber.findMany({
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
        where,
      }),
      prisma.subscriber.count({ where }),
    ])

    return { subscribers: subscribers.map(withComputedStatus), total }
  }

  async getStats() {
    const activeWhere = getStatusWhere('Active')
    const expiredWhere = getStatusWhere('Expired')
    const pendingWhere = getStatusWhere('Pending')
    const expiringSoonWhere = getExpiringSoonWhere()

    const [
      totalSubscribers,
      activeSubscribers,
      expiredSubscribers,
      pendingSubscribers,
      expiringSoon,
    ] = await prisma.$transaction([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: activeWhere }),
      prisma.subscriber.count({ where: expiredWhere }),
      prisma.subscriber.count({ where: pendingWhere }),
      prisma.subscriber.count({ where: expiringSoonWhere }),
    ])

    return {
      activeSubscribers,
      expiredSubscribers,
      expiringSoon,
      pendingSubscribers,
      totalSubscribers,
    }
  }

  async update(id: string, data: UpdateSubscriberInput) {
    const subscriber = await prisma.$transaction(async (transaction) => {
      const existingSubscriber = await transaction.subscriber.findUniqueOrThrow({ where: { id } })
      const startDate = data.startDate ?? existingSubscriber.startDate
      const expiryDate = data.expiryDate ?? existingSubscriber.expiryDate
      const updatedSubscriber = await transaction.subscriber.update({
        data: {
          ...data,
          subscriptionStatus: calculateSubscriptionStatus(startDate, expiryDate),
        },
        where: { id },
      })

      await createInitialPaymentForSubscriber(transaction, updatedSubscriber)

      return updatedSubscriber
    })

    return withComputedStatus(subscriber)
  }
}
