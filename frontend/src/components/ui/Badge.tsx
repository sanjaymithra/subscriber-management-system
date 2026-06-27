import type { HTMLAttributes, PropsWithChildren } from 'react'

type BadgeProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement>>

export function Badge({ children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
