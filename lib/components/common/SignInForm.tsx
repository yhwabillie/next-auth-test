'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HookFormInput } from '@/lib/components/common/modules/HookFormInput'
import { SignInFormSchemaType, SignInSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/lib/components/common/modules/Button'
import { useEffect, useState } from 'react'

export const SignInForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    watch,
    reset,
    handleSubmit,
    setFocus,
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
    setLoading(true)

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
            setFocus('id')
            throw new Error(res.error)
          }
        }),
      {
        loading: '로그인 중입니다...',
        success: (data) => {
          if (data) {
            reset()
            router.push('/')
            return '어서오세요 🎉'
          }
        },
        error: (error) => {
          reset()
          setFocus('id')
          return `${error}`
        },
        finally: () => setLoading(false),
      },
    )
  }

  //submit 버튼 비활성화 조건
  const isSubmitDisabled = watch('id') === '' || watch('password') === '' || !!errors.id || !!errors.password

  useEffect(() => {
    setFocus('id')
  }, [])

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="w-min-full mx-auto w-fit rounded-lg border border-blue-400/50 bg-white p-8 shadow-xl">
      <legend className="sr-only">로그인 폼</legend>
      <div className="mx-auto mb-5 flex w-fit flex-col justify-center">
        <HookFormInput register={register('id')} error={errors.id} watch={watch('id')} label="아이디" id="id" type="text" disabled={loading} />
        {errors.id && <p className="mt-2 pl-2 text-sm text-red-500">{errors.id.message}</p>}
      </div>
      <div className="mx-auto mb-5 flex w-fit flex-col justify-center text-left">
        <HookFormInput
          register={register('password')}
          error={errors.password}
          watch={watch('password')}
          label="비밀번호"
          id="password"
          type="password"
          disabled={loading}
        />
        {errors.password && <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button label={`${loading ? '로그인 중...' : '로그인'}`} disalbe={isSubmitDisabled || loading} />
    </form>
  )
}
