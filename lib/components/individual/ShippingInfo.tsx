import { UserAddressType } from '@/app/actions/address/actions'
import { EmptyTab } from './EmptyTab'
import { UseFormRegister } from 'react-hook-form'
import { OrderSchemaType } from '@/lib/zodSchema'
import { formatPhoneNumber } from '@/lib/utils'

interface ShippingInfoProps {
  addresses: UserAddressType[]
  isAddressEmpty: boolean
  setActiveTab: (tabIndex: number) => void
  setAddressActiveTabId: (id: string) => void
  addressActiveTabId: string | null
  register: UseFormRegister<OrderSchemaType>
}

export const ShippingInfo = ({ addresses, isAddressEmpty, setActiveTab, setAddressActiveTabId, addressActiveTabId, register }: ShippingInfoProps) => {
  return (
    <fieldset className="mx-4 mb-16">
      <h6 className="mb-2 block text-lg font-semibold">배송지 정보</h6>

      {isAddressEmpty ? (
        <EmptyTab
          sub_title="입력된 배송정보가 없습니다"
          title="🚚 배송지를 추가해주세요."
          type="btn"
          label="배송정보 입력하러 가기"
          clickEvent={() => setActiveTab(1)}
        />
      ) : (
        <>
          <ul className="mb-4 flex flex-col gap-2 text-sm">
            <span className="sr-only">배송지 선택</span>
            <li className="flex w-fit flex-row items-center gap-2">
              {addresses.map((item, index) => (
                <label
                  key={index}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm"
                >
                  <input
                    {...register('addressIdx')}
                    type="radio"
                    value={item.idx}
                    onChange={() => setAddressActiveTabId(item.idx)}
                    defaultChecked={index === 0}
                  />
                  <span className="font-medium">{item.addressName}</span>
                </label>
              ))}
            </li>
          </ul>

          {addresses.map(
            (item, index) =>
              addressActiveTabId === item.idx && (
                <dl key={index} className="flex flex-col gap-3 border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center gap-2">
                    <dt className="w-[200px] font-medium">받는이</dt>
                    <dd className="text-gray-700">{item.recipientName}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="w-[200px] font-medium">연락처</dt>
                    <dd>{formatPhoneNumber(item.phoneNumber)}</dd>
                    <input {...register('phoneNumber')} className="h-0 w-0" type="number" value={item.phoneNumber} />
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="w-[200px] font-medium">배송지</dt>
                    <dd className="text-gray-700">{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="w-[200px] font-medium">배송 요청사항</dt>
                    <dd className="text-gray-700">{item.deliveryNote}</dd>
                  </div>
                </dl>
              ),
          )}
        </>
      )}
    </fieldset>
  )
}
