export function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-wider">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Loading
      </div>
    </div>
  )
}
