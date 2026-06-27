import type { PropsWithChildren } from 'react'

type PageWrapperProps = PropsWithChildren<{
  className?: string
}>

export function PageWrapper({ children, className = 'p-6' }: PageWrapperProps) {
  return <main className={className}>{children}</main>
}
