'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ConFirmEmailSchemaType, ConFirmEmailSchema } from '../zodSchema'
import { toast } from 'sonner'
import { useState } from 'react'

export const PasswordResetRequestForm = () => {
  const {
    register,
    resetField,
    setValue,
    watch,
    getValues,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ConFirmEmailSchemaType>({
    resolver: zodResolver(ConFirmEmailSchema),
    mode: 'onChange',
  })

  const handlePasswordResetRequest = async () => {
    const input_email = watch('email')

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
    }
  }

  return (
    <div>
      <fieldset>
        <label>이메일: </label>
        <input {...register('email')} type="email" autoFocus />
        {errors.email && !!watch('email') && <p>{errors.email.message}</p>}
      </fieldset>
      <button type="button" onClick={handlePasswordResetRequest} disabled={!!errors.email || watch('email') === undefined}>
        이메일 발송
      </button>
    </div>
  )
}
