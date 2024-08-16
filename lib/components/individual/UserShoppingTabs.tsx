'use client'
import { ReactNode } from 'react'
import { AddressInfoTab } from './AddressInfoTab'
import { WishListTab } from './WishListTab'
import { OrderListTab } from './OrderListTab'
import { TabMenu } from './TabMenu'
import { Session } from 'next-auth'
import { CartListTab } from '@/lib/components/individual/CartListTab'
import Link from 'next/link'

export type TabItemType = {
  id: number
  label: string
  content: ReactNode
}

interface UserShoppingTabsProps {
  session: Session
}

export const UserShoppingTabs = ({ session }: UserShoppingTabsProps) => {
  if (!session.user?.idx) {
    return (
      <div className="mx-auto my-20 w-[400px] text-center">
        <p className="mb-10 text-lg font-semibold">세션이 필요합니다.</p>
        <Link href="/signIn" className="mx-auto block w-[200px] rounded-md bg-blue-400 px-10 py-4 text-white drop-shadow-md hover:bg-blue-500">
          로그인하기
        </Link>
      </div>
    )
  }

  const userIdx = session.user.idx

  const tabArr: TabItemType[] = [
    { id: 1, label: '배송정보', content: <AddressInfoTab userIdx={userIdx} /> },
    { id: 2, label: '위시리스트', content: <WishListTab userIdx={userIdx} /> },
    { id: 3, label: '장바구니', content: <CartListTab session={session} userIdx={userIdx} /> },
    { id: 4, label: '주문 상세정보', content: <OrderListTab userIdx={userIdx} /> },
  ]

  return (
    <>
      <h4 className="sr-only">마이쇼핑 탭 메뉴</h4>
      <TabMenu tabArr={tabArr} />
    </>
  )
}
