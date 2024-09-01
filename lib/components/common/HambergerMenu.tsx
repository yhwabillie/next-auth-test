import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { GoSignIn } from 'react-icons/go'
import { FaUserPen } from 'react-icons/fa6'
import Image from 'next/image'
import { FaShoppingCart } from 'react-icons/fa'
import { LuLogOut } from 'react-icons/lu'
import { UserNavItem } from './modules/UserNavItem'
import { FaUserCog } from 'react-icons/fa'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useBodyScrollStore } from '@/lib/zustandStore'

interface HambergerMenuProps {
  sessionUser: any
  isIndivisual: boolean | undefined
  isAdmin: boolean | undefined
  isAuth: any
  isGuest: boolean | undefined
  isScrolled: boolean | undefined
}

export const HamburgerMenu = ({ sessionUser, isIndivisual, isAdmin, isAuth, isGuest, isScrolled }: HambergerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const sideRef = useRef<HTMLDivElement>(null)
  const { disableScroll, enableScroll } = useBodyScrollStore()

  // 상태의 타입을 number로 명시적으로 지정
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      if (width !== newWidth) {
        // console.log(`Width changed from ${width} to ${newWidth}`)
        setWidth(newWidth) // 이제 여기서 타입 에러가 발생하지 않습니다.

        if (width !== newWidth) {
          setChanged(true)
        } else {
          setChanged(false)
        }
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)
    // 초기 너비 설정
    handleResize()

    if (changed) {
      setIsOpen(false)
      enableScroll()

      if (!sideRef.current) return
      sideRef.current.style.setProperty('right', '-100%')
    } else {
      setChanged(false)
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [width]) // 의존성 배열에 width 포함

  return (
    <>
      <button
        aria-label="sidemenu button"
        className="relative z-50 flex h-6 w-6 cursor-pointer flex-col items-center justify-center space-y-1"
        onClick={() => {
          setIsOpen(!isOpen)

          if (isOpen) {
            enableScroll()
          } else {
            disableScroll()
          }

          if (!sideRef.current) return
          const currentRight = sideRef.current.style.right
          sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
        }}
      >
        <div
          className={clsx('h-1 w-6 transform rounded-md shadow-md transition duration-300 ease-in-out', {
            'translate-y-[5px] rotate-45': isOpen,
            'bg-gray-700': (isOpen && isScrolled) || (isOpen && !isScrolled),
            'bg-white': isScrolled && !isOpen,
            'bg-primary': !isScrolled && !isOpen,
          })}
        />

        <div
          className={clsx('h-1 w-6 rounded-md shadow-md transition duration-300 ease-in-out', {
            'opacity-0': isOpen,
            'opacity-100': !isOpen,
            'bg-white': isScrolled,
            'bg-primary': !isScrolled,
          })}
        />

        <div
          className={clsx('h-1 w-6 transform rounded-md shadow-md transition duration-300 ease-in-out', {
            '-translate-y-[10px] -rotate-45': isOpen,
            'bg-gray-700': (isOpen && isScrolled) || (isOpen && !isScrolled),
            'bg-white': isScrolled && !isOpen,
            'bg-primary': !isScrolled && !isOpen,
          })}
        />
      </button>

      <div
        onClick={() => {
          setIsOpen(!isOpen)

          if (isOpen) {
            enableScroll()
          } else {
            disableScroll()
          }

          if (!sideRef.current) return
          const currentRight = sideRef.current.style.right
          sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
        }}
        className={clsx('fixed left-0 top-0 z-30 h-screen w-screen bg-black bg-opacity-70 transition-all duration-300', {
          block: isOpen,
          hidden: !isOpen,
        })}
      />
      <div ref={sideRef} className="fixed right-[-100%] top-0 z-40 h-screen w-2/3 bg-gray-200 shadow-inner transition-all duration-300 sm:w-[35%]">
        {/* 관리자 */}
        {isAdmin && (
          <section className="px-5 pt-20">
            <picture className="mx-auto mb-4 block h-[100px] w-[100px] overflow-hidden rounded-[50%] bg-gray-400/50">
              <Image
                src={sessionUser.profile_img === 'undefined' ? '/images/default_profile.jpeg' : sessionUser.profile_img}
                width={100}
                height={100}
                alt="회원 프로필 이미지"
              />
            </picture>
            <p className="mx-auto w-fit text-sm font-semibold text-blue-600">{sessionUser.user_type === 'indivisual' ? '일반회원' : '관리자'}</p>
            <p className="mx-auto mb-10 w-fit text-lg font-semibold text-gray-700">{sessionUser.name}</p>

            <ul className="flex flex-col justify-center gap-3">
              <li className="rounded-md bg-white hover:bg-gray-300/50">
                <Link
                  href="/add-product"
                  onClick={() => {
                    setIsOpen(false)
                    if (!sideRef.current) return
                    const currentRight = sideRef.current.style.right
                    sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
                  }}
                  className="flex w-full items-center gap-3"
                >
                  <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                    <FaShoppingCart className="text-lg" />
                  </span>
                  <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">상품등록</span>
                </Link>
              </li>
              <li className="rounded-md bg-white hover:bg-gray-300/50">
                <Link
                  href="/profile"
                  onClick={() => {
                    setIsOpen(false)
                    if (!sideRef.current) return
                    const currentRight = sideRef.current.style.right
                    sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
                  }}
                  className="flex w-full items-center gap-3"
                >
                  <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                    <FaUserCog className="text-lg" />
                  </span>
                  <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">회원정보</span>
                </Link>
              </li>
              <li className="rounded-md bg-white hover:bg-gray-300/50">
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/signIn' })

                    setTimeout(() => {
                      setIsOpen(false)
                    }, 0)
                  }}
                  className="flex w-full items-center gap-3"
                >
                  <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                    <LuLogOut className="text-lg" />
                  </span>
                  <span className="inline-block w-[calc(100%-(24px+0.5rem))] text-left font-semibold">로그아웃</span>
                </button>
              </li>
            </ul>
          </section>
        )}

        {/* 일반회원 */}
        {isIndivisual && (
          <section className="px-5 pt-20">
            <picture className="mx-auto mb-4 block h-[100px] w-[100px] overflow-hidden rounded-[50%] bg-gray-400/50">
              <Image
                src={sessionUser.profile_img === 'undefined' ? '/images/default_profile.jpeg' : sessionUser.profile_img}
                width={100}
                height={100}
                alt="회원 프로필 이미지"
              />
            </picture>
            <p className="mx-auto w-fit text-sm font-semibold text-blue-600">{sessionUser.user_type === 'indivisual' ? '일반회원' : '관리자'}</p>
            <p className="mx-auto mb-10 w-fit text-lg font-semibold text-gray-700">{sessionUser.name}</p>

            <ul className="flex flex-col justify-center gap-3">
              <li className="rounded-md bg-white hover:bg-gray-300/50">
                <Link
                  href="/my-shopping"
                  onClick={() => {
                    setIsOpen(false)
                    if (!sideRef.current) return
                    const currentRight = sideRef.current.style.right
                    sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
                  }}
                  className="flex w-full items-center gap-3"
                >
                  <span className="relative box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                    {sessionUser && sessionUser.cartlist_length! > 0 && (
                      <span className="absolute right-[-10px] top-[-6px] box-border block h-6 w-6 rounded-[50%] bg-red-400 text-center text-xs font-semibold leading-[24px] text-white shadow-inner">
                        {sessionUser?.cartlist_length}
                      </span>
                    )}
                    <FaShoppingCart className="text-lg" />
                  </span>
                  <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">마이쇼핑</span>
                </Link>
              </li>
              <li className="rounded-md bg-white hover:bg-gray-300/50">
                <Link
                  href="/profile"
                  onClick={() => {
                    setIsOpen(false)
                    if (!sideRef.current) return
                    const currentRight = sideRef.current.style.right
                    sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
                  }}
                  className="flex w-full items-center gap-3"
                >
                  <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                    <FaUserCog className="text-lg" />
                  </span>
                  <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">회원정보</span>
                </Link>
              </li>
              <li className="rounded-md bg-white hover:bg-gray-300/50">
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/signIn' })

                    setTimeout(() => {
                      setIsOpen(false)
                    }, 0)
                  }}
                  className="flex w-full items-center gap-3"
                >
                  <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                    <LuLogOut className="text-lg" />
                  </span>
                  <span className="inline-block w-[calc(100%-(24px+0.5rem))] text-left font-semibold">로그아웃</span>
                </button>
              </li>
            </ul>
          </section>
        )}

        {/* 비회원 */}
        {isGuest && (
          <ul className="flex flex-col justify-center gap-3 px-5 pt-20">
            <li className="rounded-md bg-white hover:bg-gray-300/50">
              <Link
                href="/signIn"
                onClick={() => {
                  setIsOpen(false)
                  if (!sideRef.current) return
                  const currentRight = sideRef.current.style.right
                  sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
                }}
                className="flex w-full items-center gap-3"
              >
                <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                  <FaUserCog className="text-lg" />
                </span>
                <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">로그인</span>
              </Link>
            </li>
            <li className="rounded-md bg-white hover:bg-gray-300/50">
              <Link
                href="/signUp/agreement"
                onClick={() => {
                  setIsOpen(false)
                  if (!sideRef.current) return
                  const currentRight = sideRef.current.style.right
                  sideRef.current.style.setProperty('right', currentRight === '0%' ? '-100%' : '0%', 'important')
                }}
                className="flex w-full items-center gap-3"
              >
                <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                  <FaUserCog className="text-lg" />
                </span>
                <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">회원가입</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* <div className="fixed left-0 top-0 h-full w-full bg-black bg-opacity-70 backdrop-blur-sm">?</div> */}
    </>
  )
}
