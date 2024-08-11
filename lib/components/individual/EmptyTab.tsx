'use client'
import Link from 'next/link'

interface EmptyTabProps {
  sub_title: string
  title: string
  label: string
  type: 'btn' | 'link'
  clickEvent?: () => void
}

export const EmptyTab = ({ sub_title, title, label, type, clickEvent }: EmptyTabProps) => {
  return (
    <div className="rounded-md bg-gray-100 p-10">
      <p className="mb-10 text-center text-gray-500">
        <span className="mb-2 block">{sub_title}</span>
        <strong className="block text-2xl">{title}</strong>
      </p>

      {type === 'btn' && (
        <button
          className="mx-auto block w-[300px] rounded-lg bg-blue-400 px-10 py-4 font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
          onClick={clickEvent}
        >
          {label}
        </button>
      )}
      {type === 'link' && (
        <Link
          href="/products"
          className="mx-auto block w-[300px] rounded-lg bg-blue-400 px-10 py-4 text-center font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
        >
          {label}
        </Link>
      )}
    </div>
  )
}
