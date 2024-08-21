import { CheckedItemType } from '@/lib/stores/cartlistStore'
import { calculateDiscountedPrice } from '@/lib/utils'
import clsx from 'clsx'
import { FaCheck, FaMinus, FaPlus } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

interface CartItemProps {
  checkedItems: CheckedItemType
  idx: string
  category: string
  name: string
  imageUrl: string
  discount_rate: number
  original_price: number
  quantity: number
  handleChangeCheckbox: () => void
  handleDecrease: () => void
  handleIncrease: () => void
  handleSetQuantity: (value: number) => void
  handleDeleteCartItem: () => void
}

export const CartItem = ({
  checkedItems,
  idx,
  category,
  name,
  imageUrl,
  discount_rate,
  original_price,
  quantity,
  handleChangeCheckbox,
  handleDecrease,
  handleIncrease,
  handleSetQuantity,
  handleDeleteCartItem,
}: CartItemProps) => {
  return (
    <li
      className={clsx('flex flex-row justify-between rounded-lg border p-3 last:mb-0', {
        'border-blue-300 bg-blue-100': checkedItems[idx],
        'border-gray-300 bg-gray-100': !checkedItems[idx],
      })}
    >
      <div className="flex flex-row">
        <div>
          <label htmlFor={idx} className="mr-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-gray-400/20 drop-shadow-md">
            <input id={idx} type="checkbox" checked={checkedItems[idx] || false} onChange={handleChangeCheckbox} />
            {checkedItems[idx] && <FaCheck className="cursor-pointer text-lg text-blue-600" />}
          </label>

          <div className="relative mr-5 mt-2 block h-20 w-20 overflow-hidden rounded-md border border-gray-400/30 drop-shadow-lg md:h-28 md:w-28 md:rounded-lg">
            <img src={imageUrl} alt={name} className="absolute left-0 top-0 object-fill" />
          </div>
        </div>

        <div className="flex w-[calc(100%-112px)] flex-col justify-end">
          <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-sm text-white drop-shadow-md">{category}</p>
          <strong className="text-md block font-medium text-gray-600">{name}</strong>

          {discount_rate === 0 ? (
            <p className="text-lg font-bold text-gray-800">{original_price.toLocaleString('ko-KR')}원</p>
          ) : (
            <div className="justify-content flex flex-row items-center gap-2">
              <p className="text-lg font-bold text-red-600">{discount_rate * 100}%</p>
              <p className="text-md text-gray-400 line-through">{original_price.toLocaleString('ko-KR')}원</p>
              <p className="text-lg font-bold text-gray-800">{calculateDiscountedPrice(original_price, discount_rate)}</p>
            </div>
          )}

          <div className="mt-2 flex w-fit flex-row items-center border border-gray-400/50">
            <div
              onClick={handleDecrease}
              className={clsx('flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200', {
                'cursor-not-allowed bg-gray-400': quantity <= 1,
              })}
            >
              <FaMinus className="text-xs" />
            </div>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(event: any) => handleSetQuantity(event.target.value)}
              className="h-8 w-8 text-center text-xs font-semibold"
            />
            <div onClick={handleIncrease} className="flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200">
              <FaPlus className="text-xs" />
            </div>
          </div>
        </div>
      </div>
      <div className="justify-top flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDeleteCartItem}
          className="flex items-center gap-2 rounded-md bg-gray-500 p-1 text-sm font-semibold text-white drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-600"
        >
          <IoMdClose className="text-xl" />
        </button>
      </div>
    </li>
  )
}
