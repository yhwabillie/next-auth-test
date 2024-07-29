'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ResetPwSchema, ResetPwSchemaType } from '../zodSchema'
import { toast } from 'sonner'

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reset_token = searchParams.get('token') // 쿼리 파라미터에서 토큰을 가져옵니다.
  const {
    register,
    resetField,
    setValue,
    watch,
    getValues,
    reset,
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
    }
  }

  useEffect(() => {
    if (!reset_token) {
      toast.error('비밀번호 갱신 토큰이 발급되지 않았습니다.')
    }
  }, [reset_token])

  return (
    <div>
      <h1>Reset PW</h1>
      <form>
        <fieldset>
          <legend>신규 비밀번호</legend>
          <input {...register('password')} id="password" type="password" autoFocus />
          {errors.password && watch('password') && <p>{errors.password.message}</p>}
        </fieldset>
        <fieldset>
          <legend>신규 비밀번호 확인</legend>
          <input {...register('password_confirm')} id="password_confirm" type="password" />
          {errors.password_confirm && watch('password_confirm') && <p>{errors.password_confirm.message}</p>}
        </fieldset>
        <button type="button" onClick={handleUpdateNewPw}>
          비밀번호 업데이트
        </button>
      </form>
    </div>
  )
}
