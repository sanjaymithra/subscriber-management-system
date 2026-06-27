import { PageWrapper } from '../components/layout/PageWrapper'
import { EmptyState } from '../components/ui/EmptyState'

type PlaceholderPageProps = {
  description?: string
  icon?: string
  title: string
}

export function PlaceholderPage({
  description = 'This module shell is ready for Phase 1 backend and database integration.',
  icon = 'dashboard_customize',
  title,
}: PlaceholderPageProps) {
  return (
    <PageWrapper className="p-container-padding">
      <EmptyState description={description} icon={icon} title={title} />
    </PageWrapper>
  )
}
