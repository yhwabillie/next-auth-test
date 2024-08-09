'use client'
import Skeleton from 'react-loading-skeleton'

export const TabContentSkeleton = () => {
  return (
    <div>
      <Skeleton width={300} height={50} className="mb-2" />
      <Skeleton width={500} height={30} count={2} />
    </div>
  )
}
