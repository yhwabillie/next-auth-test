'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm, FieldValues } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { SignInFormSchemaType, SignInSchema } from '../zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

export const SignInForm = () => {
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
    console.log(data)
    // try {
    //   const response = signIn('credentials', {
    //     redirect: true,
    //     callbackUrl: '/',
    //     id: data.id,
    //     password: data.password,
    //   })

    //   if (!response) {
    //     alert('로그인 정보가 맞지 않습니다.')
    //   }
    // } catch (error) {
    //   console.log(error)
    //   reset()
    // }
  }

  useEffect(() => {}, [watch])

  return (
    <>
      <h1>로그인 페이지</h1>
      <p>누구나 접근 가능한 화면</p>
      <button onClick={() => router.push('/')}>메인으로</button>

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
    </>
  )
}
