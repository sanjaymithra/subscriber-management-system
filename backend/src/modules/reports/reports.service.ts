import { ReportRepository } from './reports.repository.js'
import type { ReportQuery } from './reports.types.js'

export class ReportService {
  constructor(private readonly reportRepository = new ReportRepository()) {}

  getModuleStatus() {
    void this.reportRepository
    return { module: 'reports', status: 'ready' }
  }

  async getSummary(query: ReportQuery) {
    return this.reportRepository.getSummary(query)
  }
}
