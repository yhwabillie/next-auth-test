'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ForgotPwSchemaType, ForgotPwSchema } from '../zodSchema'
import { toast } from 'sonner'
import { useState } from 'react'

export const ConfirmEmailForm = () => {
  const {
    register,
    resetField,
    setValue,
    watch,
    getValues,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ForgotPwSchemaType>({
    resolver: zodResolver(ForgotPwSchema),
    mode: 'onChange',
  })

  const [isSendEmail, setIsSendEmail] = useState(false)

  const handlResetPasswordEmail = async () => {
    const email = getValues('email')

    try {
      const response = await fetch('/api/generate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), // 상태에서 email을 가져와 API에 전달
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
      } else {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error('An error occurred while sending the request.')
    }
  }

  return (
    <div>
      <div>
        <fieldset>
          <label>이메일: </label>
          <input {...register('email')} type="email" autoFocus />
          {errors.email && !!watch('email') && <p>{errors.email.message}</p>}
        </fieldset>
        <button type="button" onClick={handlResetPasswordEmail} disabled={!!errors.email || watch('email') === undefined}>
          이메일 발송
        </button>
        {isSendEmail && (
          <div>
            <p>으로 이메일이 전송되었습니다.</p> <p>링크를 확인하여 비밀번호를 재설정하세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
