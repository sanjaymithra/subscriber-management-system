import { Button } from './Button'

type EmptyStateProps = {
  title: string
  description: string
  icon?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  actionLabel,
  description,
  icon = 'hourglass_empty',
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-8">
      <div className="w-12 h-12 bg-secondary-container text-primary flex items-center justify-center mb-4">
        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
      </div>
      <h2 className="text-2xl font-bold text-on-surface">{title}</h2>
      <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6 px-4 py-2 text-xs font-bold uppercase" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
