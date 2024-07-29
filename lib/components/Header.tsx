'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { FaHeartCirclePlus } from 'react-icons/fa6'

enum TooltipTypes {
  NONE = 'NONE',
  PROFILE = 'PROFILE',
  CART = 'CART',
  WISH = 'WISH',
  DROP_DWN = 'DROP_DWN',
}

export const Header = () => {
  const router = useRouter()
  const [activeModal, setActiveModal] = useState(TooltipTypes.NONE)
  const showTooltip = (type: TooltipTypes) => setActiveModal(type)
  const closeTooltip = () => setActiveModal(TooltipTypes.NONE)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 h-[80px] bg-blue-400/50 backdrop-blur-md">
      <div className="mx-auto flex h-full w-[768px] items-center justify-between px-5">
        <h1>
          <Link href="/">Next Auth</Link>
        </h1>

        {session && session.user ? (
          <nav className="flex items-center">
            {/* <button
              onClick={() => signOut({ callbackUrl: '/signIn' })}
              className="box-border rounded-md bg-blue-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500"
            >
              Logout
            </button> */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onMouseEnter={() => showTooltip(TooltipTypes.WISH)}
                  onMouseLeave={() => closeTooltip()}
                  className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-blue-400 text-center text-sm text-white shadow-lg hover:bg-blue-600"
                >
                  <span className="sr-only">위시리스트</span>
                  <FaHeartCirclePlus className="text-lg text-pink-200" />
                </button>
                {activeModal === TooltipTypes.WISH && (
                  <span className="absolute bottom-[-35px] left-[50%] box-border block w-[80px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
                    위시리스트
                  </span>
                )}
              </div>
              <div className="relative">
                <button
                  onMouseEnter={() => showTooltip(TooltipTypes.CART)}
                  onMouseLeave={() => closeTooltip()}
                  className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-blue-400 text-center text-sm text-white shadow-lg hover:bg-blue-600"
                >
                  <span className="sr-only">장바구니</span>
                  <FaShoppingCart className="text-lg text-white" />
                </button>
                {activeModal === TooltipTypes.CART && (
                  <span className="absolute bottom-[-35px] left-[50%] box-border block w-[70px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
                    장바구니
                  </span>
                )}
              </div>
              <div className="relative">
                <button
                  onMouseEnter={() => showTooltip(TooltipTypes.PROFILE)}
                  onClick={() => showTooltip(TooltipTypes.DROP_DWN)}
                  className="block h-10 w-10 overflow-hidden rounded-[50%] border-2 border-gray-600/40 bg-white shadow-lg hover:border-blue-600"
                >
                  <span className="sr-only">사용자 프로필 이미지</span>
                  {session.user.profile_img === 'undefined' ? (
                    <Image src="/images/default_profile.jpeg" className="object-cover" alt="user profile" width={40} height={40} />
                  ) : (
                    <Image src={session.user.profile_img!} className="object-cover" alt="user profile" width={40} height={40} />
                  )}
                </button>
                {activeModal === TooltipTypes.PROFILE && (
                  <span className="absolute bottom-[-35px] left-[50%] box-border block w-[80px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
                    마이페이지
                  </span>
                )}

                {activeModal === TooltipTypes.DROP_DWN && (
                  <div
                    onMouseLeave={() => closeTooltip()}
                    className="absolute right-0 top-[50px] w-[200px] rounded-lg bg-gray-600/95 p-5 shadow-lg backdrop-blur-lg"
                  >
                    <h3 className="sr-only">사용자 메뉴 드롭다운</h3>
                    <h4 className="block border-b-[1px] border-white/50 pb-2 text-center font-medium text-white">
                      <strong className="block text-xs font-medium">일반회원</strong>
                      <span>{session.user.name}</span> 님
                    </h4>
                    <Link
                      href="/profile"
                      className="mt-4 block text-center text-sm text-white/80 transition-all duration-150 ease-in-out hover:text-white"
                    >
                      마이페이지
                    </Link>
                    <div className="mt-4">
                      <button
                        onClick={() => signOut({ callbackUrl: '/signIn' })}
                        className="box-border w-full rounded-md bg-blue-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        ) : (
          <nav className="flex gap-3">
            <Link
              href="/signIn"
              className="box-border rounded-md bg-blue-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500"
            >
              Login
            </Link>
            <Link
              href="/signUp/agreement"
              className="leading-1 box-border rounded-md bg-pink-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-pink-500"
            >
              회원가입
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
