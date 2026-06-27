import type { HTMLAttributes, PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
