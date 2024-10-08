'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ResetPwSchema, ResetPwSchemaType } from '@/lib/zodSchema'
import { toast } from 'sonner'
import { Button } from './modules/Button'
import { HookFormInput } from '@/lib/components/common/modules/HookFormInput'

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 관리
  const searchParams = useSearchParams()
  const router = useRouter()
  const reset_token = searchParams.get('token') // 쿼리 파라미터에서 토큰을 가져옵니다.
  const {
    register,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<ResetPwSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(ResetPwSchema),
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  })

  const handleUpdateNewPw = async () => {
    const new_input_pw = watch('password')

    setIsLoading(true)

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token, new_input_pw }),
      })

      if (!response.ok) {
        toast.error('신규 비밀번호 갱신 response 에러 발생')
      }

      const { status, message } = await response.json()

      switch (status) {
        case 'success':
          router.push('/signIn')
          toast.success(message)
          break
        case 'fail':
          toast.error(message)
          break
        default:
          toast.error('Unexpected status')
          break
      }
    } catch (error) {
      console.log(error)
      toast.error('신규 비밀번호 갱신 request 중 에러 발생')
    } finally {
      setIsLoading(false)
    }
  }

  //submit 버튼 비활성화 조건
  const isSubmitDisabled = watch('password') === '' || watch('password_confirm') === '' || !!errors.password || !!errors.password_confirm || isLoading

  useEffect(() => {
    if (!reset_token) {
      toast.error('비밀번호 갱신 토큰이 발급되지 않았습니다.')
    }

    setFocus('password')
  }, [reset_token])

  return (
    <div className="mx-auto w-[300px] rounded-lg border border-blue-400/50 bg-white p-6 shadow-xl md:w-[500px] md:p-8">
      <legend className="sr-only">비밀번호 재설정 폼</legend>
      <div className="mx-auto mb-5 flex w-full flex-col justify-center">
        <HookFormInput
          register={register('password')}
          error={errors.password}
          watch={watch('password')}
          label="신규 비밀번호"
          id="password"
          type="password"
        />
        {errors.password && !!watch('password') && <p className="mt-2 pl-2 text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <div className="mx-auto mb-5 flex w-full flex-col justify-center text-left">
        <HookFormInput
          register={register('password_confirm')}
          error={errors.password_confirm}
          watch={watch('password_confirm')}
          label="신규 비밀번호 확인"
          id="password_confirm"
          type="password"
          disabled={isLoading}
        />
        {errors.password_confirm && !!watch('password') && <p className="mt-2 pl-2 text-sm text-red-500">{errors.password_confirm.message}</p>}
      </div>

      <Button type="button" label={isLoading ? '업데이트 중' : '비밀번호 업데이트'} clickEvent={handleUpdateNewPw} disalbe={isSubmitDisabled} />
    </div>
  )
}
