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
  const { defaultAddress, EtcAddress, openEditAddressForm, updateDefaultAddress, showModal, deleteAddress, loading, isEmpty } =
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
        className="mb-4 ml-auto flex w-full items-center justify-center gap-2 rounded-lg bg-blue-400 p-4 text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500 md:mb-2 md:w-[200px]"
      >
        <FaPlus className="text-lg" />
        <span className="text-sm font-semibold tracking-tighter drop-shadow-md md:text-[16px]">배송지 신규입력</span>
      </button>

      <section className="mb-16 last:mb-0">
        <div>
          <h5 className="mb-3 block w-fit rounded-md bg-green-100 px-4 py-2 text-xs font-bold text-green-600">기본 배송지</h5>
          <ul className="mb-10">
            {defaultAddress.map((item) => (
              <AddressItem
                key={item.idx}
                {...item}
                handleOpenEditForm={() => openEditAddressForm(item)}
                handleRemoveAddress={() => deleteAddress(item.idx)}
              />
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-3 block w-fit rounded-md bg-blue-100 px-4 py-2 text-xs font-bold text-blue-600">기타 배송지</h5>

          {!EtcAddress.length ? (
            <EmptyTab title="입력된 기타 배송정보가 없습니다" sub_title="🚚 배송지를 추가해주세요." />
          ) : (
            <ul className="flex flex-col gap-5">
              {EtcAddress.map((item) => (
                <AddressItem
                  key={item.idx}
                  {...item}
                  handleOpenEditForm={() => openEditAddressForm(item)}
                  handleRemoveAddress={() => deleteAddress(item.idx)}
                  handleSetDefault={() => updateDefaultAddress(item.idx)}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
