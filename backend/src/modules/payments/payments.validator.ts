import { z } from 'zod'

export const paymentPlaceholderSchema = z.object({})

const paymentMethodSchema = z.enum(['Cash', 'UPI', 'Card', 'Bank Transfer'])
const paymentStatusSchema = z.enum(['Paid', 'Pending'])

export const paymentParamsSchema = z.object({
  id: z.string().trim().min(1, 'Payment identifier is required'),
})

export const paymentListQuerySchema = z.object({
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  month: z.coerce.number().int().min(1).max(12).optional(),
  page: z.coerce.number().int().min(1).default(1),
  paymentMethod: paymentMethodSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'paymentDate', 'amount']).default('paymentDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  startDate: z.coerce.date().optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
})

export const renewSubscriptionBodySchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  durationMonths: z.coerce.number().int().refine((value) => [1, 3, 6, 12].includes(value), 'Select a valid duration'),
  paymentMethod: paymentMethodSchema,
  paymentStatus: paymentStatusSchema,
  recordedByEmail: z.email('A valid recorded by email is required').trim().toLowerCase(),
  remarks: z.string().trim().optional().nullable(),
  subscriberId: z.string().trim().min(1, 'Subscriber is required'),
  transactionReference: z.string().trim().optional().nullable(),
})

export const updatePaymentBodySchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0').optional(),
  paymentMethod: paymentMethodSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  recordedByEmail: z.email('A valid recorded by email is required').trim().toLowerCase(),
  remarks: z.string().trim().optional().nullable(),
  transactionReference: z.string().trim().optional().nullable(),
}).refine((value) => Object.keys(value).length > 1, 'At least one payment field is required')
