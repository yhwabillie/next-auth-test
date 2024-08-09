'use client'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { TabItemType } from './UserShoppingTabs'
import { FaShoppingCart } from 'react-icons/fa'
import { FaStar } from 'react-icons/fa'
import { MdLocalShipping } from 'react-icons/md'
import { TbShoppingBagCheck } from 'react-icons/tb'

interface TabMenuProps {
  tabArr: TabItemType[]
}

export const TabMenu: React.FC<TabMenuProps> = ({ tabArr }: TabMenuProps) => {
  const [activeTab, setActiveTab] = useState<number>(tabArr[2].id)
  const handleTabClick = (id: number) => setActiveTab(id)

  return (
    <>
      <ul className="mb-5 flex flex-row gap-2 rounded-lg border-2 border-gray-200 bg-gray-200">
        {tabArr.map((item, index) => (
          <li
            key={index}
            onClick={() => handleTabClick(item.id)}
            className={clsx('flex w-[25%] cursor-pointer justify-center rounded-md px-5 py-3 text-center transition-all duration-300 last:mr-0', {
              'bg-white font-bold text-gray-700': activeTab === item.id,
              'border-transparent text-gray-500': activeTab !== item.id,
            })}
          >
            <button className="flex flex-row items-center justify-center gap-2">
              {item.id === 1 && <MdLocalShipping className="text-xl" />}
              {item.id === 2 && <FaStar className="text-lg" />}
              {item.id === 3 && <FaShoppingCart className="text-lg" />}
              {item.id === 4 && <TbShoppingBagCheck className="text-xl" />}
              <span className="text-sm">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence mode="wait">
        {tabArr.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                {tab.content}
              </motion.div>
            ),
        )}
      </AnimatePresence>
    </>
  )
}
