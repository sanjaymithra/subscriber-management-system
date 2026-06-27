import { z } from 'zod'

const dateSchema = z.coerce.date()
const emailSchema = z.string().trim().min(1, 'Email is required').email('Valid email is required')
const phoneSchema = z.string().trim().regex(/^\d{10}$/, 'Phone must be exactly 10 digits')
const pincodeSchema = z.string().trim().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits')

const subscriberBaseSchema = z.object({
  address: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  deliveryBoy: z.string().trim().min(1, 'Delivery boy is required'),
  email: emailSchema,
  expiryDate: dateSchema,
  fullName: z.string().trim().min(1, 'Full name is required'),
  newspaperType: z.string().trim().min(1, 'Newspaper type is required'),
  notes: z.string().trim().optional().nullable(),
  paymentStatus: z.string().trim().min(1, 'Payment status is required'),
  phone: phoneSchema,
  pincode: pincodeSchema,
  startDate: dateSchema,
  subscriberId: z.string().trim().min(1, 'Subscriber ID is required'),
  subscriptionPlan: z.string().trim().min(1, 'Subscription plan is required'),
})

export const subscriberBodySchema = subscriberBaseSchema.refine((value) => value.expiryDate > value.startDate, {
  message: 'Expiry date must be after start date',
  path: ['expiryDate'],
})

export const updateSubscriberBodySchema = subscriberBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
).refine(
  (value) => !value.startDate || !value.expiryDate || value.expiryDate > value.startDate,
  {
    message: 'Expiry date must be after start date',
    path: ['expiryDate'],
  },
)

export const subscriberParamsSchema = z.object({
  id: z.string().trim().min(1, 'Subscriber identifier is required'),
})

export const subscriberListQuerySchema = z.object({
  expiringSoon: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  newspaperType: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().trim().optional(),
  sortBy: z.enum(['fullName', 'expiryDate', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  subscriptionPlan: z.string().trim().optional(),
  subscriptionStatus: z.string().trim().optional(),
})
