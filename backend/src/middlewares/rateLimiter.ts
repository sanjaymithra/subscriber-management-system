import rateLimit from 'express-rate-limit'

export const apiRateLimiter = rateLimit({
  limit: 100,
  standardHeaders: true,
  windowMs: 15 * 60 * 1000,
})
