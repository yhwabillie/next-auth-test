'use client'
import clsx from 'clsx'
import { useState } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface HookFormInputProps {
  register: UseFormRegisterReturn
  id: string
  label: string
  type: 'email' | 'password' | 'text'
  value?: any
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: FieldError
  watch?: any
}

export const HookFormInput = ({ register, id, label, type, value, placeholder, disabled, readonly, error, watch }: HookFormInputProps) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <label htmlFor={id} className="relative block w-[400px]">
      <span
        className={clsx(' absolute left-4 top-2 block text-sm font-medium transition-all duration-150 ease-in-out', {
          '!text-red-400': error,
          'text-blue-500': !error && isFocus,
          'top-[18px] !text-lg': !error && watch === '' && !isFocus,
          'text-blue-400/50': !error,
          'text-gray-400/50': disabled,
        })}
      >
        {label}
      </span>
      <input
        {...register}
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        className={clsx(
          'text-md leading-1 block w-full rounded-md border px-[15px] pb-[10px] pt-[27px] font-normal text-blue-400 shadow-md outline-0 placeholder:font-normal ',
          {
            '!border-red-400 placeholder:!text-red-400/50 focus:!border-red-400 focus:text-red-400': error,
            'border-blue-400/50 text-blue-400/50 placeholder:text-blue-400/50 focus:border-blue-500 focus:text-blue-400': !error,
            'border-gray-400/50 text-gray-400 placeholder:text-gray-400/50': disabled,
          },
        )}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </label>
  )
}
