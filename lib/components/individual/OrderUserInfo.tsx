'use client'

interface OrderUserInfoProps {
  user_type?: string
  name?: string
  email?: string
}

export const OrderUserInfo = ({ user_type, name, email }: OrderUserInfoProps) => {
  return (
    <fieldset className="mb-8 md:mx-4 md:mb-16">
      <h6 className="mb-2 block w-fit text-[16px] font-semibold tracking-tighter md:text-lg">주문자 정보</h6>
      <dl className="flex flex-col gap-3 border-l-4 border-gray-200 pl-4">
        <div className="flex items-center gap-2">
          <dt className="w-[100px] text-sm font-medium md:w-[150px] md:text-[16px]">회원구분</dt>
          <dd className="text-sm text-gray-700 md:text-[16px]">{user_type === 'indivisual' ? '일반회원' : '어드민'}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-[100px] text-sm font-medium md:w-[150px] md:text-[16px]">이름</dt>
          <dd className="text-sm text-gray-700 md:text-[16px]">{name}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-[100px] text-sm font-medium md:w-[150px] md:text-[16px]">이메일</dt>
          <dd className="v text-sm text-gray-700 md:text-[16px]">{email}</dd>
        </div>
      </dl>
    </fieldset>
  )
}
