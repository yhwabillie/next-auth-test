'use client'

interface OrderUserInfoProps {
  user_type?: string
  name?: string
  email?: string
}

export const OrderUserInfo = ({ user_type, name, email }: OrderUserInfoProps) => {
  return (
    <fieldset className="mx-4 mb-16">
      <h5 className="mb-2 block text-lg font-semibold">주문자 정보</h5>
      <dl className="flex flex-col gap-3 border-l-4 border-gray-200 pl-4">
        <div className="flex items-center gap-2">
          <dt className="w-[150px] font-medium md:w-[200px]">회원구분</dt>
          <dd className="text-gray-700">{user_type === 'indivisual' ? '일반회원' : '어드민'}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-[150px] font-medium md:w-[200px]">이름</dt>
          <dd className="text-gray-700">{name}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-[150px] font-medium md:w-[200px]">이메일</dt>
          <dd className="text-gray-700">{email}</dd>
        </div>
      </dl>
    </fieldset>
  )
}
