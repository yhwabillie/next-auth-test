'use client'
import { LoadingSpinner } from './modules/LoadingSpinner'

export const LoadingModal = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
      <div>
        <div className="mx-auto mb-12 w-fit">
          <LoadingSpinner />
        </div>
        <p className="text-2xl font-semibold text-white">데이터 전송 중</p>
      </div>
    </div>
  )
}
