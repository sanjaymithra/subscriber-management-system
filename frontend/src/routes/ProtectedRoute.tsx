import type { PropsWithChildren } from 'react'

const routeGuardsEnabled = false
const temporaryIsAuthenticated = false

export function ProtectedRoute({ children }: PropsWithChildren) {
  if (!routeGuardsEnabled || temporaryIsAuthenticated) {
    return children
  }

  return children
}
