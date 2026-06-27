import type { Prisma, Subscriber } from '@prisma/client'
import { Prisma as PrismaNamespace } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import { logger } from '../../utils/logger.js'

const INITIAL_PAYMENT_PREFIX = 'INITIAL'

const PLAN_AMOUNTS: Record<string, number> = {
  'Digital Only': 1299,
  'Premium Print': 4999,
  'Weekend Only': 1999,
}

function getInitialPaymentReference(subscriberId: string) {
  return `${INITIAL_PAYMENT_PREFIX}-${subscriberId}`
}

function getPlanAmount(subscriptionPlan: string) {
  return PLAN_AMOUNTS[subscriptionPlan] ?? 999
}

function getDurationMonths(startDate: Date, expiryDate: Date) {
  const years = expiryDate.getFullYear() - startDate.getFullYear()
  const months = expiryDate.getMonth() - startDate.getMonth()
  const totalMonths = years * 12 + months

  return Math.max(1, totalMonths)
}

export async function createInitialPaymentForSubscriber(
  transaction: Prisma.TransactionClient,
  subscriber: Subscriber,
) {
  if (subscriber.paymentStatus.toLowerCase() !== 'paid') {
    return { created: false }
  }

  const transactionReference = getInitialPaymentReference(subscriber.subscriberId)
  const existingPayment = await transaction.payment.findFirst({
    where: {
      subscriberId: subscriber.id,
      transactionReference,
    },
  })

  const recorder = await transaction.user.findUnique({
    where: { email: 'admin@demo.com' },
  })

  if (!recorder) {
    return { created: false }
  }

  const firstRenewalPayment = await transaction.payment.findFirst({
    orderBy: { paymentDate: 'asc' },
    where: {
      subscriberId: subscriber.id,
      NOT: {
        transactionReference: {
          startsWith: `${INITIAL_PAYMENT_PREFIX}-`,
        },
      },
    },
  })

  const initialExpiryDate = firstRenewalPayment?.previousExpiryDate ?? subscriber.expiryDate
  const paymentData = {
    amount: new PrismaNamespace.Decimal(getPlanAmount(subscriber.subscriptionPlan)),
    durationMonths: getDurationMonths(subscriber.startDate, initialExpiryDate),
    newExpiryDate: initialExpiryDate,
    paymentDate: subscriber.startDate,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    previousExpiryDate: subscriber.startDate,
    recordedBy: recorder.id,
    remarks: 'Initial paid subscription record',
    subscriberId: subscriber.id,
    transactionReference,
  }

  if (existingPayment) {
    await transaction.payment.update({
      data: paymentData,
      where: { id: existingPayment.id },
    })

    return { created: false }
  }

  await transaction.payment.create({
    data: paymentData,
  })

  return { created: true }
}

export async function backfillInitialPaidSubscriberPayments() {
  const paidSubscribers = await prisma.subscriber.findMany({
    where: {
      paymentStatus: { equals: 'Paid', mode: 'insensitive' },
    },
  })

  let createdCount = 0

  for (const subscriber of paidSubscribers) {
    const result = await prisma.$transaction((transaction) => createInitialPaymentForSubscriber(transaction, subscriber))

    if (result.created) {
      createdCount += 1
    }
  }

  logger.info('Initial paid subscriber payment records are ready', {
    createdCount,
    paidSubscribers: paidSubscribers.length,
  })
}
