import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { RenewalService } from './renewals.service.js'

const renewalService = new RenewalService()

export const getRenewalModule = asyncHandler(async (_request, response) => {
  sendSuccess(response, HTTP_STATUS.OK, 'Renewals module foundation ready', renewalService.getModuleStatus())
})
