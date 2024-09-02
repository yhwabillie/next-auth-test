import { CartItemType } from '@/app/actions/cartlist/actions'
import { OrderSchemaType } from '@/lib/zodSchema'
import { UseFormRegister } from 'react-hook-form'

interface PaymentInfoProps {
  register: UseFormRegister<OrderSchemaType>
  checkedItemsInfo: CartItemType[]
  totalQuantity: number
  totalPrice: number
  calculateDiscountedPrice: (originalPrice: number, discountRate: number, quantity: number) => string
}

export const PaymentInfo = ({ register, checkedItemsInfo, totalQuantity, totalPrice, calculateDiscountedPrice }: PaymentInfoProps) => {
  return (
    <>
      <h5 className="mb-5 mt-8 block rounded-lg bg-blue-50 px-4 py-3 text-[16px] font-semibold tracking-tighter text-black md:mt-16 md:text-xl">
        💸 결제 정보
      </h5>
      <fieldset className="md:mx-4">
        <ul className="flex flex-col gap-5">
          <li className="flex flex-col gap-2">
            <span className="mb-2 block w-fit text-[16px] font-semibold tracking-tighter md:text-lg">결제수단</span>
            <ul className="mb-4 flex flex-row gap-2 text-sm">
              <li className="flex w-fit flex-row items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm">
                  <input {...register('payment')} type="radio" value="CREDIT_CARD" name="payment" defaultChecked />
                  <span>신용카드</span>
                </label>
              </li>
              <li className="flex w-fit flex-row items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm">
                  <input {...register('payment')} type="radio" value="BANK_TRANSFER" name="payment" />
                  <span>실시간 계좌이체</span>
                </label>
              </li>
            </ul>
          </li>
          <li className="flex flex-col">
            <span className="mb-2 block w-fit text-[16px] font-semibold tracking-tighter md:text-lg">구매금액</span>
            <ul>
              <li className="mb-4 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm tracking-tighter drop-shadow-sm">
                <span>총 주문상품 개수 : </span>
                <span>{`${totalQuantity}개`}</span>
              </li>
              {checkedItemsInfo.map(({ product, quantity }) => (
                <li key={product.idx} className="mb-2 flex items-center justify-between gap-x-5 px-2 text-gray-600/50">
                  <p className="flex items-center gap-4">
                    <span className="md:text-md block w-[100px] break-all text-sm font-medium md:w-[300px]">{product.name}</span>
                    <span className="md:text-md text-sm font-medium">{quantity}개</span>
                  </p>
                  <span className="md:text-md text-sm">{`${calculateDiscountedPrice(product.original_price, product.discount_rate, quantity)}`}</span>
                </li>
              ))}

              <li className="md:text-md mt-4 px-2 text-sm text-gray-600/50">
                {totalPrice >= 30000 ? '배송비(3만원 이상 무료배송) 0원' : '배송비(+3,000원)'}
              </li>

              <li className="mt-4 flex flex-row items-center justify-between border-t border-gray-300 px-2 py-4">
                <span className="text-sm text-red-600 md:text-[16px]">최종 결제금액</span>
                <span className="text-[16px] font-bold tracking-tighter text-red-600 md:text-2xl">{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원`}</span>
              </li>
            </ul>
          </li>
        </ul>
      </fieldset>
    </>
  )
}
