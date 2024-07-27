'use client'
import { signIn } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { useForm, FieldValues } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { SignInFormSchemaType, SignInSchema } from '../zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'

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

  useEffect(() => {}, [watch])

  return (
    <>
      <h1>로그인 페이지</h1>
      <p>누구나 접근 가능한 화면</p>

      {isFormLoading ? (
        <h1>Loading...</h1>
      ) : (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <legend>로그인 Form</legend>

          <div>
            <HookFormInput register={register('id')} label={'id'} id={'id'} type={'text'} placeholder={'id'} autoFocus={true} />
            {errors.id && <p>{errors.id.message}</p>}
          </div>
          <div>
            <HookFormInput register={register('password')} label={'password'} id={'password'} type={'password'} placeholder={'password'} />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button>submit</button>
        </form>
      )}
    </>
  )
}
