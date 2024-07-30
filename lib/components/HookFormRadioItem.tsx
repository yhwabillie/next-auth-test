'use client'
import clsx from 'clsx'
import { FaUserCog } from 'react-icons/fa'
import { FaUserLarge } from 'react-icons/fa6'

export const HookFormRadioItem = ({ register, id, name, type, value, checked }: any) => {
  return (
    <div className="flex flex-row justify-center gap-3">
      <div className="relative h-[100px] w-[100px] overflow-hidden rounded-lg shadow-lg">
        <label
          htmlFor={id}
          className={clsx('absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center', {
            'bg-blue-400 hover:bg-blue-500': checked,
            'bg-gray-400 hover:bg-gray-500': !checked,
          })}
        >
          {id === 'indivisual' ? (
            <>
              <FaUserCog className="text-[50px] text-white" />
              <span className="text-sm text-white">관리자</span>
            </>
          ) : (
            <>
              <FaUserLarge className="mb-2 text-[35px] text-white" />
              <span className="text-sm text-white">일반</span>
            </>
          )}
        </label>

        <input {...register} id={id} name={name} value={value} type="radio" checked={checked} />
      </div>
    </div>
  )
}
