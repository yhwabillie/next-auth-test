'use client'
import React from 'react'
import { TabContentSkeleton } from './TabContentSkeleton'
import { FaPlus } from 'react-icons/fa'
import { EmptyTab } from './EmptyTab'
import { AddressItem } from './AddressItem'
import { useAddressInfo } from '@/app/hooks'

interface AddressInfoTabProps {
  userIdx: string
}

export const AddressInfoTab = ({ userIdx }: AddressInfoTabProps) => {
  const { defaultAddress, EtcAddress, handleOpenEditForm, handleSetDefaultAddress, showModal, handleRemoveAddress, loading, isEmpty } =
    useAddressInfo(userIdx)

  if (loading) return <TabContentSkeleton />
  if (isEmpty)
    return (
      <EmptyTab
        sub_title="입력된 배송정보가 없습니다"
        title="🚚 배송지를 추가해주세요."
        type="btn"
        label="배송지 추가하기"
        clickEvent={() => showModal('addNewAddress')}
      />
    )

  return (
    <>
      <button
        onClick={() => showModal('addNewAddress')}
        className="mb-2 ml-auto flex w-[200px] items-center justify-center gap-2 rounded-lg bg-blue-400 p-4 text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
      >
        <FaPlus className="text-lg" />
        <span className="text-sm font-semibold">배송지 신규입력</span>
      </button>

      <section className="mb-16 last:mb-0">
        <div className="">
          <h5 className="mb-3 block w-fit rounded-md bg-gray-100 p-2 text-xs font-bold text-gray-500">기본 배송지</h5>
          <ul className="mb-10">
            {defaultAddress.map((item, index) => (
              <AddressItem
                key={index}
                {...item}
                handleOpenEditForm={() => handleOpenEditForm(item)}
                handleRemoveAddress={() => handleRemoveAddress(item.idx)}
              />
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-3 block w-fit rounded-md bg-gray-100 p-2 text-xs font-bold text-gray-500">기타 배송지</h5>

          {!EtcAddress.length && <EmptyTab title="입력된 기타 배송정보가 없습니다" sub_title="🚚 배송지를 추가해주세요." />}

          <ul className="flex flex-col gap-5">
            {EtcAddress.map((item, index) => (
              <AddressItem
                key={index}
                {...item}
                handleOpenEditForm={() => handleOpenEditForm(item)}
                handleRemoveAddress={() => handleRemoveAddress(item.idx)}
                setDefaultAddressBtn={
                  <button
                    type="button"
                    onClick={() => handleSetDefaultAddress(item.idx)}
                    className="block w-[120px] rounded-md border border-gray-400 bg-gray-100 p-2 text-xs font-bold text-gray-700 hover:bg-pink-200"
                  >
                    기본배송지로 선택
                  </button>
                }
              />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
