import type { Prisma, Subscriber } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import type { ChartPoint, ReportQuery, ReportSummary, RevenueReportRow, SubscriberReportRow } from './reports.types.js'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function endOfDay(date: Date) {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

function getDateRange(query: ReportQuery) {
  const today = startOfToday()

  if (query.datePreset === 'custom' && (query.startDate || query.endDate)) {
    return {
      end: query.endDate ? endOfDay(query.endDate) : undefined,
      start: query.startDate,
    }
  }

  if (query.datePreset === 'thisWeek') {
    const start = new Date(today)
    start.setDate(today.getDate() - today.getDay())

    return { end: endOfDay(today), start }
  }

  if (query.datePreset === 'lastMonth') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)

    return { end, start }
  }

  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

  return { end, start }
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

function statusWhere(status: string): Prisma.SubscriberWhereInput {
  const today = startOfToday()

  if (status === 'Active') {
    return { expiryDate: { gte: today }, startDate: { lte: today } }
  }

  if (status === 'Pending') {
    return { startDate: { gt: today } }
  }

  if (status === 'Expired') {
    return { expiryDate: { lt: today } }
  }

  return {}
}

function expiringSoonWhere(): Prisma.SubscriberWhereInput {
  const today = startOfToday()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  return {
    expiryDate: {
      gte: today,
      lte: thirtyDaysFromNow,
    },
  }
}

function buildSubscriberWhere(query: ReportQuery): Prisma.SubscriberWhereInput {
  const filters: Prisma.SubscriberWhereInput[] = []

  if (query.search) {
    filters.push({
      OR: [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { subscriberId: { contains: query.search, mode: 'insensitive' } },
        { payments: { some: { transactionReference: { contains: query.search, mode: 'insensitive' } } } },
      ],
    })
  }

  if (query.plan) {
    filters.push({ subscriptionPlan: query.plan })
  }

  if (query.status) {
    filters.push(statusWhere(query.status))
  }

  return filters.length > 0 ? { AND: filters } : {}
}

function buildPaymentWhere(query: ReportQuery): Prisma.PaymentWhereInput {
  const { end, start } = getDateRange(query)
  const filters: Prisma.PaymentWhereInput[] = []
  const paymentDate: Prisma.DateTimeFilter<'Payment'> = {}

  if (start) {
    paymentDate.gte = start
  }

  if (end) {
    paymentDate.lte = end
  }

  if (Object.keys(paymentDate).length > 0) {
    filters.push({ paymentDate })
  }

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

  if (query.plan) {
    filters.push({ subscriber: { subscriptionPlan: query.plan } })
  }

  if (query.staffMember) {
    filters.push({ recorder: { email: query.staffMember } })
  }

  if (query.status) {
    filters.push({ subscriber: statusWhere(query.status) })
  }

  return filters.length > 0 ? { AND: filters } : {}
}

function countByLabel(items: string[]) {
  const counts = new Map<string, number>()

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function buildMonthlyChart(payments: { amount: unknown; paymentDate: Date }[]) {
  const values = new Map<string, number>()

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setMonth(date.getMonth() - offset)
    values.set(monthKey(date), 0)
  }

  for (const payment of payments) {
    const key = monthKey(payment.paymentDate)

    if (values.has(key)) {
      values.set(key, (values.get(key) ?? 0) + Number(payment.amount))
    }
  }

  return Array.from(values.entries()).map(([key, value]) => {
    const [, month] = key.split('-')
    return {
      label: monthLabels[Number(month) - 1],
      value,
    }
  })
}

function buildRenewalsByMonth(payments: { paymentDate: Date }[]) {
  const values = new Map<string, number>()

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setMonth(date.getMonth() - offset)
    values.set(monthKey(date), 0)
  }

  for (const payment of payments) {
    const key = monthKey(payment.paymentDate)

    if (values.has(key)) {
      values.set(key, (values.get(key) ?? 0) + 1)
    }
  }

  return Array.from(values.entries()).map(([key, value]) => {
    const [, month] = key.split('-')
    return {
      label: monthLabels[Number(month) - 1],
      value,
    }
  })
}

function mostCommon(points: ChartPoint[], fallback: string) {
  return points.reduce<ChartPoint | null>((current, point) => {
    if (!current || point.value > current.value) {
      return point
    }

    return current
  }, null)?.label ?? fallback
}

export class ReportRepository {
  async getSummary(query: ReportQuery): Promise<ReportSummary> {
    const paymentWhere = buildPaymentWhere(query)
    const subscriberWhere = buildSubscriberWhere(query)
    const today = startOfToday()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    const [
      allPayments,
      filteredPayments,
      filteredSubscribers,
      totalSubscribers,
      activeSubscribers,
      pendingSubscribers,
      expiredSubscribers,
      expiringSoon,
      totalRevenue,
      todayRevenue,
      monthRevenue,
      activeRevenue,
      renewalsThisMonth,
      allSubscribers,
      paymentMethods,
      plans,
      staffMembers,
    ] = await prisma.$transaction([
      prisma.payment.findMany({
        select: { amount: true, paymentDate: true, paymentMethod: true },
        where: { paymentStatus: 'Paid' },
      }),
      prisma.payment.findMany({
        include: {
          recorder: { select: { email: true } },
          subscriber: { select: { fullName: true, subscriberId: true } },
        },
        orderBy: { [query.revenueSortBy === 'date' ? 'paymentDate' : 'amount']: query.revenueSortOrder },
        take: 50,
        where: paymentWhere,
      }),
      prisma.subscriber.findMany({
        include: {
          payments: {
            orderBy: { paymentDate: 'desc' },
            select: { paymentDate: true },
            take: 1,
          },
        },
        orderBy: { expiryDate: 'asc' },
        take: 50,
        where: subscriberWhere,
      }),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: statusWhere('Active') }),
      prisma.subscriber.count({ where: statusWhere('Pending') }),
      prisma.subscriber.count({ where: statusWhere('Expired') }),
      prisma.subscriber.count({ where: expiringSoonWhere() }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { paymentStatus: 'Paid' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentDate: { gte: today, lt: tomorrow }, paymentStatus: 'Paid' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentDate: { gte: monthStart, lt: nextMonth }, paymentStatus: 'Paid' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          paymentStatus: 'Paid',
          subscriber: statusWhere('Active'),
        },
      }),
      prisma.payment.count({ where: { paymentDate: { gte: monthStart, lt: nextMonth } } }),
      prisma.subscriber.findMany({ select: { expiryDate: true, startDate: true, subscriptionPlan: true } }),
      prisma.payment.findMany({ distinct: ['paymentMethod'], select: { paymentMethod: true } }),
      prisma.subscriber.findMany({ distinct: ['subscriptionPlan'], select: { subscriptionPlan: true } }),
      prisma.user.findMany({ select: { email: true } }),
    ])

    const subscriberStatusDistribution = countByLabel(
      allSubscribers.map((subscriber) => calculateSubscriptionStatus(subscriber.startDate, subscriber.expiryDate)),
    )
    const planDistribution = countByLabel(allSubscribers.map((subscriber) => subscriber.subscriptionPlan))
    const paymentMethodDistribution = countByLabel(allPayments.map((payment) => payment.paymentMethod))
    const totalPaidPayments = allPayments.length
    const totalRevenueValue = Number(totalRevenue._sum.amount ?? 0)

    return {
      cards: [
        { key: 'totalSubscribers', label: 'Total Subscribers', value: totalSubscribers, valueType: 'number' },
        { key: 'activeSubscribers', label: 'Active Subscribers', value: activeSubscribers, valueType: 'number' },
        { key: 'pendingSubscribers', label: 'Pending Subscribers', value: pendingSubscribers, valueType: 'number' },
        { key: 'expiredSubscribers', label: 'Expired Subscribers', value: expiredSubscribers, valueType: 'number' },
        { key: 'expiringSoon', label: 'Expiring Soon', value: expiringSoon, valueType: 'number' },
        { key: 'totalRevenue', label: 'Total Revenue', value: totalRevenueValue, valueType: 'currency' },
        { key: 'todayRevenue', label: "Today's Revenue", value: Number(todayRevenue._sum.amount ?? 0), valueType: 'currency' },
        { key: 'monthRevenue', label: "This Month's Revenue", value: Number(monthRevenue._sum.amount ?? 0), valueType: 'currency' },
        { key: 'renewalsThisMonth', label: 'Renewals This Month', value: renewalsThisMonth, valueType: 'number' },
      ],
      charts: {
        paymentMethodDistribution,
        renewalsByMonth: buildRenewalsByMonth(allPayments),
        revenueByMonth: buildMonthlyChart(allPayments),
        subscriberStatusDistribution,
      },
      filters: {
        paymentMethods: paymentMethods.map((payment) => payment.paymentMethod),
        plans: plans.map((plan) => plan.subscriptionPlan),
        staffMembers: staffMembers.map((user) => user.email),
        statuses: ['Active', 'Pending', 'Expired'],
      },
      quickStats: {
        averageSubscriptionValue: totalPaidPayments === 0 ? 0 : totalRevenueValue / totalPaidPayments,
        mostPopularPlan: mostCommon(planDistribution, 'No plan data'),
        mostUsedPaymentMethod: mostCommon(paymentMethodDistribution, 'No payment data'),
        totalActiveRevenue: Number(activeRevenue._sum.amount ?? 0),
        totalPaymentRecords: totalPaidPayments,
      },
      revenueRows: filteredPayments.map<RevenueReportRow>((payment) => ({
        amount: Number(payment.amount),
        date: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        staffMember: payment.recorder.email,
        subscriberId: payment.subscriber.subscriberId,
        subscriberName: payment.subscriber.fullName,
        transactionReference: payment.transactionReference,
      })),
      subscriberRows: filteredSubscribers.map<SubscriberReportRow>((subscriber: Subscriber & { payments: { paymentDate: Date }[] }) => ({
        expiryDate: subscriber.expiryDate,
        lastPayment: subscriber.payments[0]?.paymentDate ?? null,
        plan: subscriber.subscriptionPlan,
        status: calculateSubscriptionStatus(subscriber.startDate, subscriber.expiryDate),
        subscriberId: subscriber.subscriberId,
        subscriberName: subscriber.fullName,
      })),
    }
  }
}
