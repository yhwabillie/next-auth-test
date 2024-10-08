'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ConFirmEmailSchemaType, ConFirmEmailSchema } from '../../zodSchema'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { HookFormInput } from './modules/HookFormInput'
import { Button } from '@/lib/components/common/modules/Button'

export const PasswordResetRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 관리
  const {
    register,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<ConFirmEmailSchemaType>({
    resolver: zodResolver(ConFirmEmailSchema),
    mode: 'onChange',
  })

  const handlePasswordResetRequest = async () => {
    const input_email = watch('email')

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_email }),
      })

      if (!response.ok) {
        toast.error('이메일 확인 response 에러 발생')
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
      toast.error('이메일 확인 request 중 에러 발생')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setFocus('email')
  }, [])

  return (
    <div className="mx-auto w-[300px] rounded-lg border border-blue-400/50 bg-white p-6 shadow-xl md:w-[500px] md:p-8">
      <legend className="sr-only">비밀번호 재설정 폼</legend>
      <div className="mx-auto mb-5 flex w-full flex-col justify-center">
        <HookFormInput
          register={register('email')}
          error={errors.email}
          watch={watch('email')}
          label="이메일"
          id="email"
          type="email"
          disabled={isLoading}
        />
        {errors.email && !!watch('email') && <p className="mt-2 pl-2 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <Button
        type="button"
        label={isLoading ? '이메일 발송 중...' : '이메일 발송'}
        clickEvent={handlePasswordResetRequest}
        disalbe={!!errors.email || watch('email') === undefined || isLoading}
      />
    </div>
  )
}
