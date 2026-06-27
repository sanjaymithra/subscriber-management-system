import { z } from 'zod'

export const authPlaceholderSchema = z.object({})

export const loginBodySchema = z.object({
  email: z.email('Enter a valid demo account email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})
