'use client'
import { useAddressStore } from '@/lib/stores/addressStore'
import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { formatPhoneNumber } from '@/lib/utils'
import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { BsChatLeftText } from 'react-icons/bs'

export const ChangeOrderAddress = () => {
  const { hideModal, updateAddressData, orderIdx } = useOrderlistStore()
  const { fetchData, data: address_data, addressIdx } = useAddressStore()
  const { register, handleSubmit, setValue } = useForm<FieldValues>()

  useEffect(() => {
    fetchData()
  }, [])

  const handleOnSubmitNewAddress = (data: FieldValues) => {
    console.log('new addressIdx ===>', data.update_address)
    console.log('orderIdx ===>', orderIdx)

    updateAddressData(orderIdx, data.update_address)
  }

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="mb-auto mt-auto">
        <form
          onSubmit={handleSubmit(handleOnSubmitNewAddress)}
          className="relative mx-[20px] my-[50px] h-fit w-[600px] rounded-2xl bg-white p-10 shadow-lg"
        >
          <h2 className="mb-5 block text-center text-2xl font-semibold tracking-tighter">🚚 배송지 변경</h2>
          <fieldset className="flex h-auto min-h-[600px] flex-col gap-5 overflow-y-auto">
            {address_data.map((item) => (
              <label
                key={item.idx}
                htmlFor={item.idx}
                className="felx-row flex cursor-pointer items-start gap-3 rounded-2xl bg-gray-100 p-4 hover:bg-gray-200"
              >
                <input
                  {...register('update_address')}
                  type="radio"
                  id={item.idx}
                  value={item.idx}
                  name="address"
                  defaultChecked={item.idx === addressIdx}
                  onChange={(event) => {
                    const target = event.target.value
                    console.log(target)
                    setValue('update_address', target)
                  }}
                />

                <section>
                  <div className="mb-2 flex flex-row items-center gap-2">
                    <span className="font-semibold text-blue-500">{`${item.recipientName}(${item.addressName})`}</span>
                    {item.isDefault ? (
                      <span className="rounded-[5px] bg-green-100 px-[10px] py-[8px] text-xs font-semibold text-green-600">기본배송지</span>
                    ) : (
                      <span className="rounded-[5px] bg-blue-100 px-[10px] py-[8px] text-xs font-semibold text-blue-600">기타배송지</span>
                    )}
                  </div>
                  <p className="text-md mb-1 font-medium text-gray-600">{formatPhoneNumber(item.phoneNumber)}</p>
                  <p className="mb-2 text-sm font-medium tracking-tighter text-gray-600">{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</p>

                  <p className="flex items-center gap-2">
                    <BsChatLeftText className="text-sm text-gray-500" />
                    <span className="text-sm font-medium tracking-tighter text-gray-500">{item.deliveryNote}</span>
                  </p>
                </section>
              </label>
            ))}
          </fieldset>
          <div className="flex w-full flex-row justify-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => {
                hideModal('change_address')
              }}
              className="w-[50%] rounded-md bg-gray-200 p-3 font-semibold text-gray-700 drop-shadow-sm hover:bg-gray-300 "
            >
              취소
            </button>
            <button className="w-[50%] rounded-md bg-blue-400 p-3 font-semibold text-white drop-shadow-sm  hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-700">
              저장
            </button>
          </div>
        </form>
      </div>
      {/* <form
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
      </form> */}
    </div>
  )
}
