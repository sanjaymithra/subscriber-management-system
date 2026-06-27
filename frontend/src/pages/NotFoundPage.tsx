import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-container-padding">
      <div className="bg-surface-container-lowest border border-outline-variant p-8 max-w-md w-full">
        <div className="w-12 h-12 bg-secondary-container text-primary flex items-center justify-center mb-4">
          <span className="material-symbols-outlined">travel_explore</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Page not found</h1>
        <p className="text-sm text-on-surface-variant mt-2">
          The requested portal screen does not exist.
        </p>
        <Link className="inline-flex mt-6 px-4 py-2 bg-primary text-on-primary text-xs font-bold uppercase rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
