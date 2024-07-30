'use client'
import { UseFormRegisterReturn } from 'react-hook-form'
import { LuCheckCircle } from 'react-icons/lu'
import clsx from 'clsx'

interface IHookFormCheckBoxProps {
  id: string
  label: string
  checked?: boolean
  onChangeEvent?: (event: any) => void
  register?: UseFormRegisterReturn
}

export const HookFormCheckBox = ({ register, id, label, checked, onChangeEvent }: IHookFormCheckBoxProps) => {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
      <div className="relative h-[30px]">
        <input {...register} id={id} className="relative h-auto w-[30px]" type="checkbox" name={id} checked={checked} onChange={onChangeEvent} />
        <LuCheckCircle
          className={clsx('absolute left-0 top-0 text-3xl', {
            'text-blue-400': checked,
            'text-gray-400/50': !checked,
          })}
        />
      </div>
      <strong
        className={clsx('text-md text-lg font-medium tracking-tighter', {
          'text-blue-600/70': checked,
          'text-gray-600/70': !checked,
        })}
      >
        {label}
      </strong>
    </label>
  )
}
