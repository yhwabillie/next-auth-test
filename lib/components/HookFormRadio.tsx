'use client'
import { UseFormRegisterReturn } from 'react-hook-form'

export interface RadioItemType {
  id: string
  label: string
  value: string
  defaultChecked?: boolean | undefined
}

interface RadioListProps {
  register: UseFormRegisterReturn<'user_type'>
  itemList: RadioItemType[]
  label: string
  name: string
  type: 'radio'
}

export const HookFormRadioList = ({ register, itemList, label, name, type }: RadioListProps) => {
  return (
    <fieldset>
      <legend>{label}</legend>

      {itemList.map((item: RadioItemType, index: number) => (
        <div key={index}>
          <label htmlFor={item.id}>{item.label}</label>
          <input {...register} id={item.id} name={name} value={item.value} type={type} defaultChecked={item.defaultChecked} />
        </div>
      ))}
    </fieldset>
  )
}
