'use client'
import { useRouter } from 'next/navigation'
import { useForm, FieldValues } from 'react-hook-form'

export const SignUpForm = () => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<FieldValues>()

  const handleSubmitForm = (data: FieldValues) => {
    console.log(data)
  }

  return (
    <>
      <h1>회원가입 페이지</h1>
      <p>누구나 접근 가능한 화면</p>
      <button onClick={() => router.push('/')}>메인으로</button>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <legend>회원가입 Form</legend>

        <fieldset>
          <legend>User Type</legend>
          <div>
            <label htmlFor="indivisual">일반</label>
            <input {...register('user_type', { required: true })} id="indivisual" name="user_type" value={'indivisual'} defaultChecked type="radio" />
          </div>
          <div>
            <label htmlFor="admin">어드민</label>
            <input {...register('user_type', { required: true })} id="admin" name="user_type" value={'admin'} type="radio" />
          </div>
        </fieldset>

        <fieldset>
          <label htmlFor="name">Name</label>
          <input {...register('name', { required: true })} id="name" name="name" type="text" placeholder="name" />
        </fieldset>

        <fieldset>
          <label htmlFor="id">ID</label>
          <input {...register('id', { required: true })} id="id" name="id" type="text" placeholder="ID" />
        </fieldset>

        <fieldset>
          <label htmlFor="email">Email</label>
          <input {...register('email', { required: true })} id="email" name="email" type="email" placeholder="Email" />
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
