'use client'
import { useAddressDataStore, useOrderDataStore } from '@/lib/zustandStore'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { TabContentSkeleton } from './TabContentSkeleton'

export const ChangeOrderAddress = () => {
  const { data: session } = useSession()
  const userIdx = session?.user?.idx
  const { fetchData, setUserIdx, data, addressIdx } = useAddressDataStore()
  const { updateData, setOrderIdx, setNewAddressIdx, orderIdx } = useOrderDataStore()
  const { register, handleSubmit, setValue } = useForm<FieldValues>()
  const { hideModal } = useOrderDataStore()

  const handleSubmitAddress = async (inputData: FieldValues) => {
    setOrderIdx(orderIdx)
    setNewAddressIdx(inputData.update_address)
    updateData()
  }

  useEffect(() => {
    setUserIdx(userIdx!)
    fetchData()
  }, [])

  return (
    <div className="fixed left-0 top-0 z-20 flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
      <form
        onSubmit={handleSubmit(handleSubmitAddress)}
        className="box-border flex min-h-full w-[600px] flex-col justify-between rounded-2xl bg-white p-10 shadow-lg"
      >
        <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">배송지 변경</h2>
        <div className="mb-4 h-full">
          <ul>
            {data.map((item, index) => (
              <li key={index} className="mb-5 last:mb-0">
                <label>
                  {item.isDefault ? <div>기본배송지</div> : <div>{`기타배송지 ${index}`}</div>}
                  <input
                    {...register('update_address', { required: true })}
                    value={item.idx}
                    defaultChecked={item.idx === addressIdx}
                    onChange={(event) => {
                      const target = event.target.value
                      console.log(target)
                      setValue('update_address', target)
                    }}
                    type="radio"
                    name="address"
                  />
                  <strong>{`${item.addressName}(${item.recipientName})`}</strong>
                  <p>{item.phoneNumber}</p>
                  <p>{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</p>
                  <select disabled={true}>
                    <option>{item.deliveryNote}</option>
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-grow gap-3">
          <button type="button" onClick={() => hideModal('changeAddress')}>
            닫기
          </button>
          <button>배송지 변경</button>
        </div>
      </form>
    </div>
  )
}
