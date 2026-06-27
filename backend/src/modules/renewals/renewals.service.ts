import { RenewalRepository } from './renewals.repository.js'

export class RenewalService {
  constructor(private readonly renewalRepository = new RenewalRepository()) {}

  getModuleStatus() {
    void this.renewalRepository
    return { module: 'renewals', status: 'ready' }
  }
}
