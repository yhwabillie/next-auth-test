'use client'
import { UseFormRegisterReturn } from 'react-hook-form'

interface HookFormInputProps {
  register: UseFormRegisterReturn
  id: string
  label: string
  type: 'email' | 'password' | 'text'
  value?: any
  placeholder?: any
  disabled?: boolean
  readonly?: boolean
  autoFocus?: boolean
}

export const HookFormInput = ({ register, id, label, type, value, placeholder, disabled, readonly, autoFocus }: HookFormInputProps) => {
  return (
    <label htmlFor={id} className="block">
      <span className="text-md mb-1 block font-medium text-blue-400/50">{label}</span>
      <input
        {...register}
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autoFocus}
        className="block w-full rounded-md border border-blue-400/50 px-4 py-3 text-lg font-normal leading-6 text-blue-400 shadow-md outline-0 placeholder:font-normal placeholder:text-blue-400/50 focus:border-blue-400"
      />
    </label>
  )
}
