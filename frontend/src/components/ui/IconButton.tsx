import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type IconButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string
  label: string
}>

export function IconButton({
  children,
  className = '',
  icon,
  label,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type={type}
      {...props}
    >
      <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
      {children}
    </button>
  )
}
