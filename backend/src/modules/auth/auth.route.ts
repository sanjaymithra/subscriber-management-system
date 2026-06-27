import { Router } from 'express'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { getAuthModule, login } from './auth.controller.js'
import { loginBodySchema } from './auth.validator.js'

export const authRoutes = Router()

authRoutes.get('/', getAuthModule)
authRoutes.post('/login', validateRequest({ body: loginBodySchema }), login)
