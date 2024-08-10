'use client'
import { useAddressDataStore } from '@/lib/zustandStore'
import React from 'react'

export const EmptyAddress = () => {
  //새로한 거
  const { showModal } = useAddressDataStore()

  return (
    <div className="rounded-md bg-gray-100 p-10">
      <p className="mb-10 text-center text-gray-500">
        <span className="mb-2 block">입력된 배송정보가 없습니다</span>
        <strong className="block text-2xl">🚚 배송지를 추가해주세요.</strong>
      </p>
      <button
        className="mx-auto block w-[300px] rounded-lg bg-blue-400 px-10 py-4 font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
        onClick={() => {
          showModal('addNewAddress')
        }}
      >
        배송지 추가하기
      </button>
    </div>
  )
}
