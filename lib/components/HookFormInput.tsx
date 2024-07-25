'use client'
import { RefObject } from 'react'
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
    <fieldset>
      <legend>{label}</legend>
      <label htmlFor={id}>{label}</label>
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
      />
    </fieldset>
  )
}
