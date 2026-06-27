import { z } from 'zod'

export const reportPlaceholderSchema = z.object({})

export const reportQuerySchema = z.object({
  datePreset: z.enum(['thisWeek', 'thisMonth', 'lastMonth', 'custom']).default('thisMonth'),
  endDate: z.coerce.date().optional(),
  paymentMethod: z.string().trim().optional(),
  plan: z.string().trim().optional(),
  revenueSortBy: z.enum(['date', 'amount']).default('date'),
  revenueSortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().optional(),
  staffMember: z.string().trim().optional(),
  startDate: z.coerce.date().optional(),
  status: z.string().trim().optional(),
})
