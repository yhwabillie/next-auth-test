'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { LinkBtn } from '@/lib/components/common/modules/LinkBtn'
import { UserMenuDropdown } from '@/lib/components/common/modules/UserMenuDropdown'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { UserNavItem } from '../modules/UserNavItem'

export enum TooltipTypes {
  NONE = 'NONE',
  MY_SHOP = 'MY_SHOP',
  DROP_DWN = 'DROP_DWN',
  ADD_PRODUCT = 'ADD_PRODUCT',
}

export const Header = () => {
  const { data: session, status } = useSession()
  const isIndivisual = status === 'authenticated' && session && session.user && session.user.user_type === 'indivisual'
  const isAdmin = status === 'authenticated' && session && session.user && session.user.user_type === 'admin'
  const isAuth = status === 'authenticated' && session && session.user
  const isLoading = status === 'loading'
  const isNotAuth = status !== 'loading' && !isAuth

  return (
    <header className="sticky top-0 z-10 h-[80px] bg-blue-400/50 backdrop-blur-md">
      <div className="mx-auto flex h-full w-[1200px] items-center justify-between px-5">
        <nav className="flex flex-row gap-3">
          <ul className="flex flex-row gap-3">
            <li>
              <h1>
                <Link href="/" className="font-medium text-blue-600">
                  MAIN
                </Link>
              </h1>
            </li>
            <li>
              <Link href="/search" className="font-medium text-blue-600">
                SEARCH
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="flex items-center">
          {isLoading && (
            <div className="flex gap-3">
              <Skeleton width={75} height={40} />
              <Skeleton width={75} height={40} />
            </div>
          )}

          <div className="flex items-center gap-3">
            {isIndivisual && (
              <UserNavItem sessionUser={session.user} label="마이쇼핑" path="/my-shopping" type={TooltipTypes.MY_SHOP}>
                <FaShoppingCart className="text-lg text-white" />
              </UserNavItem>
            )}

            {isAdmin && (
              <UserNavItem label="상품등록" path="/add-product" type={TooltipTypes.ADD_PRODUCT}>
                <FaShoppingCart className="text-lg text-white" />
              </UserNavItem>
            )}

            {isAuth && <UserMenuDropdown sessionUser={session.user} />}
          </div>

          {isNotAuth && (
            <div className="flex gap-3">
              <LinkBtn label="Login" path="/signIn" bgColor="blue" />
              <LinkBtn label="회원가입" path="/signUp/agreement" bgColor="pink" />
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
