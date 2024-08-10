'use client'
import { updateAddress } from '@/app/actions/address/actions'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { useAddressDataStore } from '@/lib/zustandStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const AddressUpdateForm = () => {
  const { data: session } = useSession()
  const userIdx = session?.user?.idx
  const { edit_address, showModal, hideModal, setUserIdx, fetchData, setEditAddress, updatePostcode, onSubmitUpdateAddress } = useAddressDataStore()

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<AddressFormSchemaType>({
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
    if (edit_address) {
      setValue('postcode', edit_address.postcode)
      setValue('addressLine1', edit_address.addressLine1)
    }
  }, [edit_address])

  return (
    <div className="fixed left-0 top-0 z-20 flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
      <section className="box-border flex min-h-full w-[600px] flex-col justify-between rounded-2xl bg-white p-10 shadow-lg">
        <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">배송지 정보 수정</h2>
        <div className="mb-4 h-full">
          <form onSubmit={handleSubmit(onSubmitUpdateAddress)}>
            <fieldset className="border-b border-gray-300">
              <div className="mb-2 py-4">
                <legend>배송지 이름</legend>
                <input
                  {...register('addressName')}
                  id="addressName"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setEditAddress({ ...edit_address, addressName: event.target.value })
                  }}
                  className="border border-black p-2"
                  type="text"
                  placeholder="배송지 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>수령인 이름</legend>
                <input
                  {...register('recipientName')}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setEditAddress({ ...edit_address, recipientName: event.target.value })
                  }}
                  id="recipientName"
                  className="border border-black p-2"
                  type="text"
                  placeholder="수령인 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>연락처</legend>
                <input
                  {...register('phoneNumber')}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setEditAddress({ ...edit_address, phoneNumber: event.target.value })
                  }}
                  id="phoneNumber"
                  className="border border-black p-2"
                  type="text"
                  placeholder="연락처를 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>주소</legend>
                <div className="flex flex-col gap-3">
                  <div>
                    <input
                      {...register('postcode')}
                      value={edit_address.postcode}
                      id="postcode"
                      type="text"
                      className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <input
                      {...register('addressLine1')}
                      value={edit_address.addressLine1}
                      id="addressLine1"
                      type="text"
                      className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <button type="button" onClick={() => showModal('postcode')} className="bg-blue-400 p-2">
                      주소찾기
                    </button>
                  </div>
                  <input
                    {...register('addressLine2')}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setEditAddress({ ...edit_address, addressLine2: event.target.value })
                    }}
                    id="addressLine2"
                    type="text"
                    className="w-[400px] border border-black p-2"
                    placeholder="나머지 주소를 입력해주세요"
                  />
                </div>
              </div>
              <div className="mb-2 py-4">
                <legend>배송 요청 사항</legend>
                <select
                  {...register('deliveryNote')}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    setEditAddress({ ...edit_address, deliveryNote: event.target.value })
                  }}
                  id="deliveryNote"
                  className="w-[300px] border border-black p-2"
                >
                  <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                  <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                  <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
                </select>
              </div>
            </fieldset>
            <div className="flex flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  hideModal('editAddress')
                }}
                className="w-[50%] bg-gray-500 p-2 text-white"
              >
                취소
              </button>
              <button type="submit" className="w-[50%] bg-blue-500 p-2 text-white">
                저장
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
