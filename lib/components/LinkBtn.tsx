'use client'
import clsx from 'clsx'
import Link from 'next/link'

interface LinkBtnProps {
  label: string
  path: string
  bgColor: string
}

export const LinkBtn = ({ label, path, bgColor }: LinkBtnProps) => {
  return (
    <Link
      href={path}
      className={clsx('box-border rounded-md px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out', {
        'bg-blue-400 hover:bg-blue-500': bgColor === 'blue',
        'bg-pink-400 hover:bg-pink-500': bgColor === 'pink',
      })}
    >
      {label}
    </Link>
  )
}
