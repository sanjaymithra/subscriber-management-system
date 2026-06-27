import { SettingsRepository } from './settings.repository.js'

export class SettingsService {
  constructor(private readonly settingsRepository = new SettingsRepository()) {}

  getModuleStatus() {
    void this.settingsRepository
    return { module: 'settings', status: 'ready' }
  }
}
