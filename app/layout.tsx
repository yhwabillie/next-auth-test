import { AuthProvider } from '@/lib/components/common/provider/AuthProvider'
import type { Metadata } from 'next'
import { Header } from '@/lib/components/common/layout/Header'
import { Toaster } from 'sonner'
import '../public/styles/globals.css'
import { FramerMotionProvider } from '@/lib/components/common/FramerMotionProvider'
import { ModalProvider } from '@/lib/components/common/provider/ModalProvider'
import { PreloadResources } from './preload-resources'

export const metadata: Metadata = {
  title: 'Next Auth Test',
  description: 'Generated by Next Auth Test',
  other: {},
}

interface RootLayoutType {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Readonly<RootLayoutType>) {
  return (
    <>
      <PreloadResources />
      <html lang="ko">
        <AuthProvider>
          <Toaster position="top-center" theme="light" richColors closeButton />
          <Header />
          <FramerMotionProvider>{children}</FramerMotionProvider>
          <ModalProvider />
        </AuthProvider>
      </html>
    </>
  )
}
