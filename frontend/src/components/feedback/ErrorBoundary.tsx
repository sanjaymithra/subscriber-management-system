import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error boundary caught an error', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-container-padding">
          <div className="bg-surface-container-lowest border border-outline-variant p-8 max-w-md w-full">
            <div className="w-12 h-12 bg-error-container text-error flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">error</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Something went wrong</h1>
            <p className="text-sm text-on-surface-variant mt-2">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
