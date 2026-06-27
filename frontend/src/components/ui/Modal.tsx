import { type PropsWithChildren, useId } from 'react'
import { IconButton } from './IconButton'

type ModalProps = PropsWithChildren<{
  isOpen: boolean
  title: string
  onClose: () => void
}>

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const titleId = useId()

  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-on-background/40 px-container-padding"
      role="dialog"
    >
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant shadow-md">
        <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider" id={titleId}>{title}</h2>
          <IconButton
            className="h-8 w-8 text-outline hover:bg-surface-container-low hover:text-on-surface"
            icon="close"
            label="Close dialog"
            onClick={onClose}
          />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
