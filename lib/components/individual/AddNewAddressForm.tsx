'use client'
import { AddNewAddressFormSchema, AddNewAddressFormSchemaType, AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { useAddressDataStore } from '@/lib/zustandStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const AddNewAddressForm = () => {
  const { showModal, hideModal, new_address, edit_address, onSubmitNewAddress, updatePostcode } = useAddressDataStore()

  //새로한 거
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddNewAddressFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddNewAddressFormSchema),
  })

  const handleSubmitNewAddress = (data: AddNewAddressFormSchemaType) => {
    onSubmitNewAddress(data)
    updatePostcode('')
  }

  useEffect(() => {
    setValue('new_postcode', new_address.new_postcode)
    setValue('new_addressLine1', new_address.new_addressLine1)
  }, [new_address])

  return (
    <div className="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70">
      <form onSubmit={handleSubmit(handleSubmitNewAddress)}>
        <section className="box-border flex h-auto w-[600px] flex-col rounded-2xl bg-white p-10 shadow-lg">
          <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">배송지 추가하기</h2>
          <div className="scroll-area mb-4 min-h-[300px] overflow-auto rounded-xl border border-gray-300 pl-3 drop-shadow-md">
            <fieldset className="border-b border-gray-300">
              <div className="mb-2 py-4">
                <legend>배송지 이름</legend>
                <input
                  {...register('addressName')}
                  id="addressName"
                  className="border border-black p-2"
                  type="text"
                  placeholder="배송지 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>수령인 이름</legend>
                <input
                  {...register('recipientName')}
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
                      {...register('new_postcode')}
                      id="new_postcode"
                      type="text"
                      className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
                      placeholder="우편번호"
                      readOnly
                    />
                    <input
                      {...register('new_addressLine1')}
                      id="new_addressLine1"
                      type="text"
                      className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
                      placeholder="주소"
                      readOnly
                    />
                    <button onClick={() => showModal('postcode')} type="button" className="bg-blue-400 p-2">
                      주소찾기
                    </button>
                  </div>
                  <input
                    {...register('addressLine2')}
                    id="addressLine2"
                    type="text"
                    className="w-[400px] border border-black p-2"
                    placeholder="나머지 주소를 입력해주세요"
                  />
                </div>
              </div>
              <div className="mb-2 py-4">
                <legend>배송 요청 사항</legend>
                <select {...register('deliveryNote')} id="deliveryNote" className="w-[300px] border border-black p-2">
                  <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                  <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                  <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
                </select>
              </div>
            </fieldset>
          </div>

          <div className="flex flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                hideModal('addNewAddress')
              }}
              className="bg-3 text-md w-[50%] rounded-md bg-gray-400 px-3 py-4 font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-3 text-md w-[50%] rounded-md bg-blue-400 px-3 py-4 font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
