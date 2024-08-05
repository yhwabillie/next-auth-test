'use client'
import clsx from 'clsx'
import { useState } from 'react'
import { AddressInfoTab } from './AddressInfoTab'
import { WishListTab } from './WishListTab'
import { BasketTab } from './BashketTab'
import { OrderListTab } from './OrderListTab'

export const TabMenu = () => {
  const tabs = [
    { id: 1, label: '배송정보', content: <AddressInfoTab /> },
    { id: 2, label: '위시리스트', content: <WishListTab /> },
    { id: 3, label: '장바구니', content: <BasketTab /> },
    { id: 4, label: '주문/배송조회', content: <OrderListTab /> },
  ]

  const [activeTab, setActiveTab] = useState<number>(tabs[2].id)
  const handleTabClick = (id: number) => {
    setActiveTab(id)
  }

  return (
    <div>
      <h4 className="sr-only">마이 쇼핑 탭메뉴</h4>
      <ul className="flex flex-row gap-3 py-10">
        {tabs.map((item, index) => (
          <li
            key={index}
            onClick={() => handleTabClick(item.id)}
            className={clsx('mr-4 cursor-pointer border-b-2 pb-2  transition-all duration-300', {
              ' border-blue-500 font-bold text-blue-500': activeTab === item.id,
              'border-transparent text-gray-500': activeTab !== item.id,
            })}
          >
            <button>{item.label}</button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id} className="rounded border p-4">
                {tab.content}
              </div>
            ),
        )}
      </div>
    </div>
  )
}
