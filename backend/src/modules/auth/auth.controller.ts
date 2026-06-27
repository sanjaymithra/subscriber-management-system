import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { AuthService } from './auth.service.js'
import type { LoginInput } from './auth.types.js'

const authService = new AuthService()

export const getAuthModule = asyncHandler(async (_request, response) => {
  sendSuccess(response, HTTP_STATUS.OK, 'Auth module foundation ready', authService.getModuleStatus())
})

export const login = asyncHandler(async (request, response) => {
  const result = await authService.login(request.body as LoginInput)

  sendSuccess(response, HTTP_STATUS.OK, 'Login successful', result)
})
