import { createContext } from 'react'

export type ComingSoonContextValue = {
  showComingSoon: (feature: string) => void
}

export const ComingSoonContext = createContext<ComingSoonContextValue | null>(null)
