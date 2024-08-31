'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { UserMenuDropdown } from '@/lib/components/common/modules/UserMenuDropdown'
import { UserNavItem } from '../modules/UserNavItem'
import { SearchBar } from '../SearchBar'
import { BsShop } from 'react-icons/bs'
import { useEffect, useState } from 'react'
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
      className={clsx('sticky top-0 z-40 box-border h-[60px] min-w-[460px] backdrop-blur-md transition-colors duration-300', {
        'bg-primary/80 shadow-inner': isScrolled,
      })}
    >
      <div className="mx-auto flex h-full w-full items-center justify-between px-5 xl:w-[1200px]">
        <nav className="flex flex-row gap-3">
          <ul className="flex flex-row gap-3 lg:w-[165px]">
            <li>
              <h1>
                <Link
                  aria-label="home"
                  href="/"
                  className={clsx('flex items-center gap-2 text-accent transition-colors duration-300', {
                    'text-white': isScrolled,
                  })}
                >
                  <BsShop
                    className={clsx('text-2xl text-primary', {
                      'text-white': isScrolled,
                    })}
                  />
                  <span className={`font-matemasie mt-[-5px] hidden lg:block`}>Shopping</span>
                </Link>
              </h1>
            </li>
          </ul>
        </nav>

        <SearchBar isScrolled={isScrolled} />

        <nav className="flex w-fit items-center justify-between">
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
