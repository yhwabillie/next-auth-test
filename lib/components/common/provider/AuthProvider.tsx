'use client'
import { useAddressStore } from '@/lib/stores/addressStore'
import { SessionProvider } from 'next-auth/react'
import { useBodyScrollStore, useModalStore } from '@/lib/zustandStore'
import clsx from 'clsx'

interface ProvidersProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: ProvidersProps) => {
  const { modalState } = useModalStore()
  const { modals } = useAddressStore()
  const { isBodyOverflowHidden } = useBodyScrollStore()
  const address_modal_state = Object.values(modals).some((item) => item === true)

  return (
    <SessionProvider>
      <body
        className={clsx(`overflow-x-hidden bg-[#f1f4f6]`, {
          'overflow-hidden': modalState || address_modal_state || isBodyOverflowHidden,
        })}
      >
        {children}
      </body>
    </SessionProvider>
  )
}
