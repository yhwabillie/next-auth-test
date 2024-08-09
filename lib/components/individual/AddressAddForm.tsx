'use client'
import { useAddressStore } from '@/lib/zustandStore'
import { useEffect } from 'react'
import { UseFormRegister } from 'react-hook-form'

interface AddressAddFormProps {
  setValue: {
    method: any
  }
  register: {
    method: UseFormRegister<{
      addressName: string
      recipientName: string
      phoneNumber: string
      postcode: string
      addressLine1: string
      addressLine2: string
      deliveryNote: string
    }>
  }
  onSubmit: {
    handleSubmitData: (data: any) => Promise<void>
  }
  onClickHandlers: {
    handleShowForm: () => void
    handleShowModal: () => void
  }
}

export const AddressAddForm: React.FC<AddressAddFormProps> = ({ setValue, register, onSubmit, onClickHandlers }) => {
  const { postcode, addressLine1 } = useAddressStore()

  return (
    <section>
      <form onSubmit={onSubmit.handleSubmitData}>
        <fieldset className="border-b border-gray-300">
          <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">배송지 등록</h5>

          <div className="mb-2 py-4">
            <legend>배송지 이름</legend>
            <input
              {...register.method('addressName')}
              id="addressName"
              className="border border-black p-2"
              type="text"
              placeholder="배송지 이름을 작성해주세요"
            />
          </div>

          <div className="mb-2 py-4">
            <legend>수령인 이름</legend>
            <input
              {...register.method('recipientName')}
              id="recipientName"
              className="border border-black p-2"
              type="text"
              placeholder="수령인 이름을 작성해주세요"
            />
          </div>

          <div className="mb-2 py-4">
            <legend>연락처</legend>
            <input
              {...register.method('phoneNumber')}
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
                  {...register.method('postcode')}
                  id="postcode"
                  type="text"
                  className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
                  readOnly
                />
                <input
                  {...register.method('addressLine1')}
                  id="addressLine1"
                  type="text"
                  className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
                  readOnly
                />
                <button onClick={onClickHandlers.handleShowModal} type="button" className="bg-blue-400 p-2">
                  주소찾기
                </button>
              </div>
              <input
                {...register.method('addressLine2')}
                id="addressLine2"
                type="text"
                className="w-[400px] border border-black p-2"
                placeholder="나머지 주소를 입력해주세요"
              />
            </div>
          </div>
          <div className="mb-2 py-4">
            <legend>배송 요청 사항</legend>
            <select {...register.method('deliveryNote')} id="deliveryNote" className="w-[300px] border border-black p-2">
              <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
              <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
              <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
            </select>
          </div>
        </fieldset>
        <div>
          <button className="w-full bg-blue-400 p-4">신규 배송지 추가</button>
        </div>
      </form>
      <button className="bg-green-400 p-2" onClick={onClickHandlers.handleShowForm}>
        취소!
      </button>
    </section>
  )
}
