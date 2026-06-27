import { Router } from 'express'
import { getSettingsModule } from './settings.controller.js'

export const settingsRoutes = Router()

settingsRoutes.get('/', getSettingsModule)
