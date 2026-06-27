import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: string
    variant?: ButtonVariant
  }
>

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:opacity-90 shadow-sm active:scale-95',
  secondary:
    'bg-secondary-container text-on-secondary-fixed hover:bg-secondary-container/80',
  ghost: 'text-outline hover:text-error',
  outline:
    'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low',
}

export function Button({
  children,
  className = '',
  icon,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {icon && <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
