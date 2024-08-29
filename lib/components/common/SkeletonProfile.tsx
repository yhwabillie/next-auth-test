'use client'

export const SkeletonProfile = () => {
  return (
    <div className="absolute left-0 top-0 z-10 mx-auto w-fit">
      {/* 프로필 이미지 스켈레톤 */}
      <div className="relative h-[200px] w-[200px] overflow-hidden rounded-[50%] border border-gray-300 shadow-lg">
        <div className="absolute inset-0 animate-pulse rounded-[50%] bg-gray-200"></div>
      </div>

      {/* 프로필 이미지 변경 버튼 스켈레톤 */}
      <div className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-[50%] border border-gray-300/50 bg-white shadow-lg">
        <div className="h-10 w-10 animate-pulse rounded-[50%] bg-gray-300"></div>
      </div>
    </div>
  )
}
