import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ReportService } from './reports.service.js'
import type { ReportQuery } from './reports.types.js'

const reportService = new ReportService()

export const getReportModule = asyncHandler(async (_request, response) => {
  sendSuccess(response, HTTP_STATUS.OK, 'Reports module foundation ready', reportService.getModuleStatus())
})

export const getReportSummary = asyncHandler(async (request, response) => {
  const summary = await reportService.getSummary(request.query as unknown as ReportQuery)

  sendSuccess(response, HTTP_STATUS.OK, 'Reports fetched successfully', summary)
})
