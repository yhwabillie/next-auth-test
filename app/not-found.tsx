'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <section aria-labelledby="page-heading" className="flex h-[calc(100vh-60px)] items-center justify-center bg-gray-100">
      <div className="mx-auto w-[320px] rounded-3xl bg-white p-10 text-center shadow-lg md:w-[450px]">
        <h2 id="page-heading" className="text-4xl font-bold text-blue-500 sm:text-5xl">
          404
        </h2>
        <p className="mt-2 text-lg font-medium tracking-tight text-gray-600 sm:text-xl">페이지가 없습니다</p>
        <p className="mb-10 mt-1 text-sm tracking-tight text-gray-500">요청하신 페이지는 사라졌거나, 아직 만들어지지 않았어요.</p>
        <Link href="/" className="block w-full rounded-lg bg-blue-500 p-3 font-medium text-white hover:bg-blue-700">
          메인으로
        </Link>
      </div>
    </section>
  )
}
