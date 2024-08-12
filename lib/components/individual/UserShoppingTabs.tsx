'use client'
import { ReactNode } from 'react'
import { AddressInfoTab } from './AddressInfoTab'
import { WishListTab } from './WishListTab'
import { CartListTab } from './CartLIstTab'
import { OrderListTab } from './OrderListTab'
import { TabMenu } from './TabMenu'
import { Session } from 'next-auth'

export type TabItemType = {
  id: number
  label: string
  content: ReactNode
}

interface UserShoppingTabsProps {
  session: Session
}

export const UserShoppingTabs = ({ session }: UserShoppingTabsProps) => {
  const tabArr: TabItemType[] = [
    { id: 1, label: '배송정보', content: <AddressInfoTab session={session} /> },
    { id: 2, label: '위시리스트', content: <WishListTab /> },
    { id: 3, label: '장바구니', content: <CartListTab /> },
    { id: 4, label: '주문/배송조회', content: <OrderListTab /> },
  ]

  return (
    <>
      <h4 className="sr-only">마이쇼핑 탭 메뉴</h4>
      <TabMenu tabArr={tabArr} />
    </>
  )
}
