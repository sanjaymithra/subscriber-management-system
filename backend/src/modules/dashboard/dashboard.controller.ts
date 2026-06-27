import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { DashboardService } from './dashboard.service.js'

const dashboardService = new DashboardService()

export const getDashboardModule = asyncHandler(async (_request, response) => {
  const stats = await dashboardService.getDashboardStats()

  sendSuccess(response, HTTP_STATUS.OK, 'Dashboard statistics fetched successfully', stats)
})
