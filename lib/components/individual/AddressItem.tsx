import { formatPhoneNumber } from '@/lib/utils'
import React, { ReactNode } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

interface AddressItemProps {
  addressName: string
  recipientName: string
  phoneNumber: string
  postcode: string
  addressLine1: string
  addressLine2: string
  deliveryNote: string
  handleOpenEditForm: () => void
  handleRemoveAddress: () => void
  handleSetDefault?: () => void
}

export const AddressItem = React.memo(
  ({
    addressName,
    recipientName,
    phoneNumber,
    postcode,
    addressLine1,
    addressLine2,
    deliveryNote,
    handleOpenEditForm,
    handleRemoveAddress,
    handleSetDefault,
  }: AddressItemProps) => {
    return (
      <li className="relative rounded-lg bg-blue-200/70 p-5 drop-shadow-sm">
        <strong className="mb-1 block text-sm tracking-tighter md:text-[16px]">{`${addressName} (${recipientName})`}</strong>
        <p className="mb-2 text-sm font-medium tracking-tighter text-gray-500 md:text-[16px]">{formatPhoneNumber(phoneNumber)}</p>
        <p className="mb-4 text-sm tracking-tighter md:text-[16px]">{`(${postcode}) ${addressLine1} ${addressLine2}`}</p>
        <div className="relative mb-4 w-full md:w-fit">
          <IoIosArrowDown className="absolute right-2 top-[50%] z-0 translate-y-[-50%] text-xl" />
          <select disabled className="w-full rounded-md border border-gray-400 px-4 py-3 text-sm disabled:bg-gray-100 md:w-[300px]">
            <option className="text-gray-500">{deliveryNote}</option>
          </select>
        </div>
        <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={handleOpenEditForm}
            className="block w-[60px] rounded-md border border-gray-400 bg-green-100 p-2 text-xs font-bold text-gray-700 hover:bg-green-200"
          >
            수정
          </button>
          <button
            type="button"
            onClick={handleRemoveAddress}
            className="block w-[60px] rounded-md border border-gray-400 bg-pink-100 p-2 text-xs font-bold text-gray-700 hover:bg-pink-200"
          >
            삭제
          </button>
          {handleSetDefault && (
            <button
              type="button"
              onClick={handleSetDefault}
              className="block w-[120px] rounded-md border border-gray-400 bg-gray-100 p-2 text-xs font-bold text-gray-700 hover:bg-pink-200"
            >
              기본배송지로 선택
            </button>
          )}
        </div>
      </li>
    )
  },
)
