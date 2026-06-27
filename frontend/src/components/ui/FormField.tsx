import type { InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

type FormFieldProps = PropsWithChildren<{
  id: string
  label: string
}>

export function FormField({ children, id, label }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-outline uppercase" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border-outline-variant rounded-lg text-sm px-3 py-2 bg-surface focus:ring-1 focus:ring-primary focus:outline-none ${props.className ?? ''}`}
      {...props}
    />
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full border-outline-variant rounded-lg text-sm px-3 py-2 bg-surface focus:ring-1 focus:ring-primary focus:outline-none ${props.className ?? ''}`}
      {...props}
    />
  )
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`h-8 bg-background border border-outline-variant rounded text-xs px-2 focus:ring-1 focus:ring-primary focus:outline-none ${props.className ?? ''}`}
      {...props}
    />
  )
}
