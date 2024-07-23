'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm, FieldValues } from 'react-hook-form'

export const SignInForm = () => {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<FieldValues>()

  const handleSubmitForm = async (data: FieldValues) => {
    try {
      const response = signIn('credentials', {
        redirect: true,
        callbackUrl: '/',
        id: data.id,
        password: data.password,
      })

      if (!response) {
        alert('로그인 정보가 맞지 않습니다.')
      }
    } catch (error) {
      console.log(error)
      reset()
    }
  }

  return (
    <>
      <h1>로그인 페이지</h1>
      <p>누구나 접근 가능한 화면</p>
      <button onClick={() => router.push('/')}>메인으로</button>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <legend>로그인 Form</legend>

        <fieldset>
          <label htmlFor="id">ID</label>
          <input {...register('id', { required: true })} id="id" name="id" type="text" placeholder="ID" />
        </fieldset>

        <fieldset>
          <label htmlFor="password">PW</label>
          <input {...register('password', { required: true })} id="password" name="password" type="password" placeholder="password" />
        </fieldset>

        <button>submit</button>
      </form>
    </>
  )
}
