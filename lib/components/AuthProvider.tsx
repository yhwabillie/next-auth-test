'use client'
import { SessionProvider } from 'next-auth/react'
import { useAddressStore, useModalStore } from '../zustandStore'
import clsx from 'clsx'
import { PostCodeModal } from './individual/PostCodeModal'

interface ProvidersProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: ProvidersProps) => {
  const { modalState } = useModalStore()
  const { isPostcodeOpen } = useAddressStore()

  return (
    <SessionProvider>
      <body
        className={clsx('bg-gray-200', {
          'overflow-hidden': modalState,
        })}
      >
        {children}

        {isPostcodeOpen && <PostCodeModal />}
      </body>
    </SessionProvider>
  )
}
