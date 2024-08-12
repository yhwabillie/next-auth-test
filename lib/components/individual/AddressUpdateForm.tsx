'use client'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { useAddressDataStore } from '@/lib/zustandStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IoIosArrowDown } from 'react-icons/io'

export const AddressUpdateForm = () => {
  const { edit_address, showModal, hideModal, handleSubmitUpdateAddress, setEditAddress } = useAddressDataStore()

  const { register, handleSubmit, setValue } = useForm<AddressFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      addressName: edit_address.addressName,
      recipientName: edit_address.recipientName,
      phoneNumber: edit_address.phoneNumber,
      postcode: edit_address.postcode,
      addressLine1: edit_address.addressLine1,
      addressLine2: edit_address.addressLine2,
      deliveryNote: edit_address.deliveryNote,
    },
  })

  useEffect(() => {
    setValue('postcode', edit_address.postcode)
    setValue('addressLine1', edit_address.addressLine1)
  }, [edit_address])

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="mb-auto mt-auto">
        <form
          onSubmit={handleSubmit(handleSubmitUpdateAddress)}
          className="relative mx-[20px] my-[50px] h-fit w-[600px] rounded-2xl bg-white p-10 shadow-lg"
        >
          <h2 className="mb-5 block text-center text-2xl font-semibold tracking-tighter">배송지 정보 수정</h2>
          <fieldset className="h-auto min-h-[600px] overflow-y-auto">
            <label htmlFor="addressName" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">배송지 이름</span>
              <input
                {...register('addressName')}
                id="addressName"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setEditAddress({ ...edit_address, addressName: event.target.value })
                }}
                type="text"
                className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                placeholder="배송지 이름을 작성해주세요"
              />
            </label>

            <label htmlFor="recipientName" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">수령인 이름</span>
              <input
                {...register('recipientName')}
                id="recipientName"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setEditAddress({ ...edit_address, recipientName: event.target.value })
                }}
                type="text"
                className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                placeholder="수령인 이름을 작성해주세요"
              />
            </label>

            <label htmlFor="phoneNumber" className="relative mb-8 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">연락처</span>
              <input
                {...register('phoneNumber')}
                id="phoneNumber"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setEditAddress({ ...edit_address, phoneNumber: event.target.value })
                }}
                type="text"
                className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                placeholder="연락처를 작성해주세요"
              />
            </label>

            <div className="mb-8">
              <div className="mb-3 flex flex-row items-center gap-2">
                <label htmlFor="postcode" className="relative block w-[140px] drop-shadow-md">
                  <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">우편번호</span>
                  <input
                    {...register('postcode')}
                    id="postcode"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setEditAddress({ ...edit_address, postcode: event.target.value })
                    }}
                    type="text"
                    className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                    placeholder="우편번호"
                    readOnly
                  />
                </label>
                <button
                  type="button"
                  onClick={() => showModal('postcode')}
                  className="box-border h-[63px] w-[100px] rounded-md bg-blue-400 text-sm font-semibold text-white drop-shadow-md hover:bg-blue-500"
                >
                  주소 찾기
                </button>
              </div>

              <label htmlFor="addressLine1" className="relative mb-3 block w-full drop-shadow-md">
                <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">주소</span>
                <input
                  {...register('addressLine1')}
                  id="addressLine1"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setEditAddress({ ...edit_address, addressLine1: event.target.value })
                  }}
                  type="text"
                  className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                  placeholder="주소"
                  readOnly
                />
              </label>

              <label htmlFor="addressLine2" className="relative block w-full drop-shadow-md">
                <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">상세주소</span>
                <input
                  {...register('addressLine2')}
                  id="addressLine2"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setEditAddress({ ...edit_address, addressLine2: event.target.value })
                  }}
                  type="text"
                  className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                  placeholder="상세주소"
                />
              </label>
            </div>

            <label htmlFor="deliveryNote" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">배송요청사항</span>

              <select
                {...register('deliveryNote')}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setEditAddress({ ...edit_address, deliveryNote: event.target.value })
                }}
                id="deliveryNote"
                className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
              >
                <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
              </select>

              <IoIosArrowDown className="absolute right-[15px] top-[20px] text-2xl text-blue-500" />
            </label>
          </fieldset>

          <div className="flex w-full flex-row justify-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => hideModal('editAddress')}
              className="w-[50%] rounded-md bg-gray-200 p-3 font-semibold text-gray-700 drop-shadow-sm hover:bg-gray-300 "
            >
              취소
            </button>
            <button type="submit" className="w-[50%] rounded-md bg-blue-400 p-3 font-semibold text-white  drop-shadow-sm hover:bg-blue-500">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
