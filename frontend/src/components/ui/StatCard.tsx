type StatCardProps = {
  icon?: string
  iconClassName?: string
  label: string
  onClick?: () => void
  trend?: string
  trendClassName?: string
  value: string
}

export function StatCard({
  icon,
  iconClassName = 'text-primary',
  label,
  onClick,
  trend,
  trendClassName = 'text-primary',
  value,
}: StatCardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between hover:bg-surface transition-colors text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className={`material-symbols-outlined ${iconClassName}`} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-on-surface">{value}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold mt-1 ${trendClassName}`}>
            <span className="material-symbols-outlined !text-[14px]" aria-hidden="true">
              trending_up
            </span>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </Component>
  )
}
