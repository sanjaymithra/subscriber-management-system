import { useContext } from 'react'
import { ComingSoonContext } from '../contexts/soonContext'

export function useComingSoon() {
  const context = useContext(ComingSoonContext)

  if (!context) {
    throw new Error('useComingSoon must be used within ComingSoonProvider')
  }

  return context
}
