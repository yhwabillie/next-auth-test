'use client'
import clsx from 'clsx'
import { FaUserCog } from 'react-icons/fa'
import { FaUserLarge } from 'react-icons/fa6'

export const HookFormRadioItem = ({ register, id, name, type, value, checked, defaultChecked, readOnly, disabled }: any) => {
  return (
    <div className="flex flex-row justify-center gap-3">
      <div className="relative h-[100px] w-[100px] overflow-hidden rounded-lg shadow-lg">
        <label
          htmlFor={id}
          className={clsx(
            'absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center transition-all duration-150 ease-in-out',
            {
              'bg-blue-400': checked,
              'bg-gray-400': !checked && disabled,
              'bg-gray-400 hover:bg-gray-500': !checked && !disabled,
            },
          )}
        >
          {id === 'indivisual' ? (
            <>
              <FaUserLarge className="mb-2 text-[36px] text-white" />
              <span className="text-sm text-white">일반</span>
            </>
          ) : (
            <>
              <FaUserCog className="text-[50px] text-white" />
              <span className="text-sm text-white">관리자</span>
            </>
          )}
        </label>

        <input {...register} id={id} name={name} value={value} type="radio" checked={checked} defaultChecked={defaultChecked} disabled={disabled} />
      </div>
    </div>
  )
}
