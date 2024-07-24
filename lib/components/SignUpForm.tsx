'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { SignUpFormSchemaType, SignUpSchema } from '../zodSchema'
import { HookFormRadioList, RadioItemType } from './HookFormRadio'
require('dotenv').config()

export const SignUpForm = () => {
  const router = useRouter()
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      user_type: 'indivisual',
      name: '',
      id: '',
      email: '',
      password: '',
      password_confirm: '',
    },
  })

  const handleSubmitForm = async (data: any) => {
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

  const radioDataList: RadioItemType[] = [
    {
      id: 'indivisual',
      label: '일반',
      value: 'indivisual',
      defaultChecked: true,
    },
    {
      id: 'admin',
      value: 'admin',
      label: '어드민',
    },
  ]

  return (
    <>
      <h1>회원가입 페이지</h1>
      <p>누구나 접근 가능한 화면</p>
      <button onClick={() => router.push('/')}>메인으로</button>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <legend>회원가입 Form</legend>

        <HookFormRadioList register={register('user_type')} itemList={radioDataList} label={'user_type'} name={'user_type'} type={'radio'} />

        <div>
          <HookFormInput register={register('name')} id={'name'} label={'name'} type={'text'} placeholder={'name'} autoFocus={true} />
          <p>{errors.name && !!watch('name') && `${errors.name.message}`}</p>
        </div>

        <div>
          <HookFormInput register={register('id')} id={'id'} label={'id'} type={'text'} placeholder={'id'} />
          <p>{errors.id && !!watch('id') && `${errors.id.message}`}</p>
        </div>

        <div>
          <HookFormInput register={register('email')} id={'email'} label={'email'} type={'email'} placeholder={'email'} />
          <p>{errors.email && !!watch('email') && `${errors.email.message}`}</p>
        </div>

        <div>
          <HookFormInput register={register('password')} id={'password'} label={'password'} type={'password'} placeholder={'password'} />
          <p>{errors.password && !!watch('password') && `${errors.password.message}`}</p>
        </div>

        <div>
          <HookFormInput
            register={register('password_confirm')}
            id={'password_confirm'}
            label={'password_confirm'}
            type={'password'}
            placeholder={'password_confirm'}
          />
          <p>{errors.password_confirm && `${errors.password_confirm.message}`}</p>
        </div>

        <button>submit</button>
      </form>
    </>
  )
}
