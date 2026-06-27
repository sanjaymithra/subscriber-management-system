import type { PropsWithChildren } from 'react'

const routeGuardsEnabled = false
const temporaryIsAuthenticated = false

export function GuestRoute({ children }: PropsWithChildren) {
  if (!routeGuardsEnabled || !temporaryIsAuthenticated) {
    return children
  }

  return children
}
