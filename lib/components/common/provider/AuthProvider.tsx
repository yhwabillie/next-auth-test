'use client'
import { useAddressStore } from '@/lib/stores/addressStore'
import { SessionProvider } from 'next-auth/react'
import { useBodyScrollStore, useModalStore } from '@/lib/zustandStore'
import clsx from 'clsx'
import localFont from 'next/font/local'

interface ProvidersProps {
  children: React.ReactNode
}

const Pretendard = localFont({
  src: [
    {
      path: '../../../../public/fonts/Pretendard-Regular.subset.woff',
      weight: '400',
    },
    {
      path: '../../../../public/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
    },
    {
      path: '../../../../public/fonts/Pretendard-Medium.subset.woff',
      weight: '500',
    },
    {
      path: '../../../../public/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
    },
    {
      path: '../../../../public/fonts/Pretendard-SemiBold.subset.woff',
      weight: '600',
    },
    {
      path: '../../../../public/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
    },
    {
      path: '../../../../public/fonts/Pretendard-Bold.subset.woff',
      weight: '700',
    },
    {
      path: '../../../../public/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
})

export const AuthProvider = ({ children }: ProvidersProps) => {
  const { modalState } = useModalStore()
  const { modals } = useAddressStore()
  const { isBodyOverflowHidden } = useBodyScrollStore()
  const address_modal_state = Object.values(modals).some((item) => item === true)

  return (
    <SessionProvider>
      <body
        className={clsx(`bg-[#f1f4f6] ${Pretendard.className}`, {
          'overflow-hidden': modalState || address_modal_state || isBodyOverflowHidden,
        })}
      >
        {children}
      </body>
    </SessionProvider>
  )
}
