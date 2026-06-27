import { Toaster } from 'sonner'
import { ErrorBoundary } from './components/feedback/ErrorBoundary'
import { ComingSoonProvider } from './contexts/ComingSoonContext'
import { QueryProvider } from './contexts/QueryProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ComingSoonProvider>
          <AppRoutes />
          <Toaster richColors />
        </ComingSoonProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
