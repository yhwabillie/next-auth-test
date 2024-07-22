import { Providers } from '@/lib/components/Providers'
import type { Metadata } from 'next'
import { Header } from '@/lib/components/Header'
import { Footer } from '@/lib/components/Footer'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

interface RootLayoutType {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Readonly<RootLayoutType>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
