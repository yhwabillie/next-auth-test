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
  autoFocus?: boolean
  error?: FieldError
}

export const HookFormInput = ({ register, id, label, type, value, placeholder, disabled, readonly, autoFocus, error }: HookFormInputProps) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <label htmlFor={id} className="block">
      <span
        className={clsx('text-md mb-1 block font-medium', {
          '!text-red-400': error,
          'text-blue-500': !error && isFocus,
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
        autoFocus={autoFocus}
        className={clsx(
          'text-md leading-1 block h-[50px] w-full rounded-md border  px-4 py-3 font-normal text-blue-400 shadow-md outline-0 placeholder:font-normal ',
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
