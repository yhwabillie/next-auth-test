'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { SignInFormSchemaType, SignInSchema } from '../zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './Button'

export const SignInForm = () => {
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)
  const router = useRouter()
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      id: '',
      password: '',
    },
  })

  const handleSubmitForm = async (data: SignInFormSchemaType) => {
    setIsFormLoading(true)

    toast.promise(
      async () =>
        await signIn('credentials', {
          id: data.id,
          password: data.password,
          redirect: false,
        }).then((res) => {
          if (res?.ok) {
            return true
          } else if (res?.error) {
            throw new Error(res.error)
          }
        }),
      {
        loading: '로그인 중입니다.',
        success: (data) => {
          if (data) {
            reset()
            router.refresh()
            return '어서오세요 🎉'
          }
        },
        error: (err) => {
          //auth.ts에서 받은 error message
          return `${err}`
        },
        finally: () => {
          setIsFormLoading(false)
        },
      },
    )
  }

  //submit 버튼 비활성화 조건
  const isSubmitDisabled = watch('id') === '' || watch('password') === '' || !!errors.id || !!errors.password

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <legend>로그인 Form</legend>

      <div className="mb-5">
        <HookFormInput register={register('id')} label="아이디" id="id" type="text" placeholder="id" autoFocus={true} />
        {errors.id && <p className="mt-2 text-sm text-red-500">{errors.id.message}</p>}
      </div>
      <div className="mb-5">
        <HookFormInput
          register={register('password')}
          error={errors.password}
          label="비밀번호"
          id="password"
          type="password"
          placeholder="password"
        />
        {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button label="로그인" disalbe={isSubmitDisabled} />
    </form>
  )
}
