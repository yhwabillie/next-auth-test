'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { UserMenuDropdown } from '@/lib/components/common/modules/UserMenuDropdown'
import { UserNavItem } from '../modules/UserNavItem'
import { SearchBar } from '../SearchBar'
import { BsShop } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { HamburgerMenu } from '../HambergerMenu'
import clsx from 'clsx'

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
  const isGuest = status !== 'loading' && !isAuth

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={clsx('sticky left-0 top-0 z-40 flex h-[60px] w-full justify-center backdrop-blur-md transition-colors duration-300', {
        'bg-primary/80 shadow-inner': isScrolled,
      })}
    >
      <div className="flex h-full w-[calc(100%-40px)] items-center justify-between gap-[20px]">
        <ul className="flex flex-row gap-3">
          <li>
            <h1>
              <Link
                aria-label="home"
                href="/"
                className={clsx('flex items-center gap-2 text-black transition-colors duration-300', {
                  'text-white': isScrolled,
                })}
              >
                <BsShop
                  className={clsx('text-2xl text-primary', {
                    'text-white': isScrolled,
                  })}
                />
                <span className={`mt-[-5px] hidden pt-[8px] lg:block`}>SHOPPING</span>
              </Link>
            </h1>
          </li>
        </ul>

        <SearchBar isScrolled={isScrolled} />

        <div className="relative lg:hidden">
          <HamburgerMenu
            sessionUser={session?.user}
            isIndivisual={isIndivisual}
            isAdmin={isAdmin}
            isAuth={isAuth}
            isGuest={isGuest}
            isScrolled={isScrolled}
          />
        </div>

        <nav className="hidden w-fit items-center justify-between lg:flex">
          <div className="ml-auto flex items-center gap-3">
            {isIndivisual && (
              <UserNavItem sessionUser={session.user} label="마이쇼핑" path="/my-shopping" type={TooltipTypes.MY_SHOP} isScrolled={isScrolled}>
                <FaShoppingCart
                  className={clsx('text-lg ', {
                    'text-primary': isScrolled,
                  })}
                />
              </UserNavItem>
            )}

            {isAdmin && (
              <UserNavItem label="상품등록" path="/add-product" type={TooltipTypes.ADD_PRODUCT} isScrolled={isScrolled}>
                <FaShoppingCart
                  className={clsx('text-lg ', {
                    'text-primary': isScrolled,
                  })}
                />
              </UserNavItem>
            )}

            {isAuth && <UserMenuDropdown sessionUser={session.user} isScrolled={isScrolled} />}
          </div>

          {isGuest && (
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <Link className="block rounded-[5px] bg-secondary px-2 py-2 text-sm font-semibold text-white shadow-inner" href="/signIn">
                  로그인
                </Link>
                <Link className="block rounded-[5px] bg-secondary px-2 py-2 text-sm font-semibold text-white shadow-inner" href="/signUp/agreement">
                  회원가입
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
