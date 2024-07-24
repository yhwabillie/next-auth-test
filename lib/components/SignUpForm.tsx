'use client'
import { useRouter } from 'next/navigation'
import { useForm, FieldValues } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { signUpSchema } from '../zodSchema'
require('dotenv').config()

export const SignUpForm = () => {
  const router = useRouter()
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      user_type: 'indivisual',
      name: '',
      id: '',
      email: '',
      password: '',
      password_confirm: '',
    },
  })

  const handleSubmitForm = async (data: FieldValues) => {
    console.log(data)

    // try {
    //   const response = await fetch(`/api/signUp`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       user_type: data.user_type,
    //       name: data.name,
    //       id: data.id,
    //       email: data.email,
    //       password: data.password,
    //     }),
    //   })

    //   if (!response.ok) {
    //     reset()
    //     alert('회원가입에 실패했습니다.')
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }

  useEffect(() => {}, [watch])

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

        <div>
          <fieldset>
            <legend>Name</legend>
            <label htmlFor="name">Name</label>
            <input {...register('name')} id="name" name="name" type="text" placeholder="name" autoFocus={true} />
          </fieldset>
          <p>{errors.name && !!watch('name') && `${errors.name.message}`}</p>
        </div>

        <div>
          <fieldset>
            <legend>ID</legend>
            <label htmlFor="id">ID</label>
            <input {...register('id', { required: true })} id="id" name="id" type="text" placeholder="ID" />
          </fieldset>
          <p>{errors.id && !!watch('id') && `${errors.id.message}`}</p>
        </div>

        <div>
          <fieldset>
            <legend>Email</legend>
            <label htmlFor="email">Email</label>
            <input {...register('email', { required: true })} id="email" name="email" type="email" placeholder="Email" />
          </fieldset>
          <p>{errors.email && !!watch('email') && `${errors.email.message}`}</p>
        </div>

        <div>
          <HookFormInput
            register={register('password', { required: true })}
            id={'password'}
            label={'password'}
            type={'password'}
            placeholder={'password'}
          />
          <p>{errors.password && !!watch('password') && `${errors.password.message}`}</p>
        </div>

        <div>
          <HookFormInput
            register={register('password_confirm', { required: true })}
            id={'password_confirm'}
            label={'password confirm'}
            type={'password'}
            placeholder={'password confirm'}
          />
          <p>{errors.password_confirm && !!watch('password_confirm') && `${errors.password_confirm}`}</p>
        </div>

        <button>submit</button>
      </form>
    </>
  )
}
