import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { SettingsService } from './settings.service.js'

const settingsService = new SettingsService()

export const getSettingsModule = asyncHandler(async (_request, response) => {
  sendSuccess(response, HTTP_STATUS.OK, 'Settings module foundation ready', settingsService.getModuleStatus())
})
