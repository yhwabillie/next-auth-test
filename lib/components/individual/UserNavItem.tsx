'use client'
import Link from 'next/link'
import { useState } from 'react'
import { TooltipTypes } from '@/lib/components/Header'

interface UserNavItemProps {
  children: React.ReactNode
  label: string
  path: string
  type: TooltipTypes
}

export const UserNavItem = ({ children, label, path, type }: UserNavItemProps) => {
  const [activeTooltip, setActiveTooltip] = useState(TooltipTypes.NONE)
  const showTooltip = (type: TooltipTypes) => setActiveTooltip(type)
  const closeTooltip = () => setActiveTooltip(TooltipTypes.NONE)

  return (
    <div className="relative">
      <Link
        href={path}
        onMouseEnter={() => showTooltip(type)}
        onMouseLeave={() => closeTooltip()}
        className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-blue-400 text-center text-sm text-white shadow-lg hover:bg-blue-600"
      >
        {children}
      </Link>
      {activeTooltip === type && (
        <span className="absolute bottom-[-35px] left-[50%] box-border block w-[70px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
          {label}
        </span>
      )}
    </div>
  )
}
