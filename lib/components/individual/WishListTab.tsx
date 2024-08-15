'use client'
import { EmptyTab } from './EmptyTab'
import { TabContentSkeleton } from './TabContentSkeleton'
import { useWishlistInfo } from '@/app/hooks'
import { WishlistItem } from './WishlistItem'

interface WishListTabProps {
  userIdx: string
}

export const WishListTab = ({ userIdx }: WishListTabProps) => {
  const { data, isEmpty, loading, handleToggleCartStatus, handleDeleteWishItem } = useWishlistInfo(userIdx)

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="위시리스트가 비었습니다" title="🤩 사고싶은 제품을 추가해주세요." type="link" label="위시리스트 채우러가기" />
      ) : (
        <>
          <h5 className="mb-2 block px-2 text-xl font-semibold text-black">위시리스트 상품</h5>
          <ul className="px-2">
            {data.map(({ product }) => (
              <WishlistItem
                key={product.idx}
                category={product.category}
                name={product.name}
                imageUrl={product.imageUrl}
                original_price={product.original_price}
                discount_rate={product.discount_rate}
                isInCart={product.isInCart}
                loading={loading}
                handleDeleteWishItem={() => handleDeleteWishItem(product.idx)}
                handleToggleCartStatus={() => handleToggleCartStatus(product.idx)}
              />
            ))}
          </ul>
        </>
      )}
    </>
  )
}
