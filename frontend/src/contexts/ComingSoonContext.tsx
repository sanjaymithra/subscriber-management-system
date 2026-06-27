import { type PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { Modal } from '../components/ui/Modal'
import { ComingSoonContext } from './soonContext'

export function ComingSoonProvider({ children }: PropsWithChildren) {
  const [feature, setFeature] = useState<string | null>(null)

  const showComingSoon = useCallback((nextFeature: string) => {
    setFeature(nextFeature)
  }, [])

  const value = useMemo(() => ({ showComingSoon }), [showComingSoon])

  return (
    <ComingSoonContext.Provider value={value}>
      {children}
      <Modal
        isOpen={feature !== null}
        onClose={() => setFeature(null)}
        title="Coming Soon"
      >
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-secondary-container text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined" aria-hidden="true">construction</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{feature}</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              This module is prepared in the frontend shell and will be connected during a later backend phase.
            </p>
          </div>
        </div>
      </Modal>
    </ComingSoonContext.Provider>
  )
}
