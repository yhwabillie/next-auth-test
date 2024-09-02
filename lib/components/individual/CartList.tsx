import { CartItemType } from '@/app/actions/cartlist/actions'
import { CartItem } from './CartItem'

interface CartlistProps {
  cartItems: CartItemType[]
  checkedItems: { [key: string]: boolean }
  setCheckedItems: (idx: string) => void
  increaseQuantity: (idx: string) => void
  decreaseQuantity: (idx: string) => void
  setQuantity: (idx: string, quantity: number) => void
  deleteCartItem: (idx: string) => void
}

export const CartList = ({
  cartItems,
  checkedItems,
  setCheckedItems,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  deleteCartItem,
}: CartlistProps) => {
  return (
    <fieldset className="mb-8 md:mx-4 md:mb-16">
      <h6 className="mb-2 block w-fit text-[16px] font-semibold md:text-lg">장바구니</h6>
      <ul className="flex flex-col gap-3">
        {cartItems.map(({ product, quantity }, index) => (
          <CartItem
            index={index}
            key={product.idx}
            {...product}
            quantity={quantity}
            checkedItems={checkedItems}
            handleChangeCheckbox={() => setCheckedItems(product.idx)}
            handleIncrease={() => increaseQuantity(product.idx)}
            handleDecrease={() => decreaseQuantity(product.idx)}
            handleSetQuantity={(e: any) => setQuantity(product.idx, parseInt(e.target.value, 10))}
            handleDeleteCartItem={() => deleteCartItem(product.idx)}
          />
        ))}
      </ul>
    </fieldset>
  )
}
