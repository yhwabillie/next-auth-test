'use client'
import { SessionProvider } from 'next-auth/react'
import { useModalStore } from '../zustandStore'
import clsx from 'clsx'

interface ProvidersProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: ProvidersProps) => {
  const { modalState } = useModalStore()

  return (
    <SessionProvider>
      <body
        className={clsx('', {
          'overflow-hidden': modalState,
        })}
      >
        {children}
      </body>
    </SessionProvider>
  )
}
