'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { SignUpFormSchemaType, SignUpSchema } from '../zodSchema'
import { HookFormRadioList, RadioItemType } from './HookFormRadio'
import { toast, Toaster } from 'sonner'
import { confirmDuplicateData } from '@/app/actions/signUp/confirmData'
import { useAgreementStore } from '../zustandStore'
require('dotenv').config()

export const SignUpForm = () => {
  const [isConfirmID, setIsConfirmID] = useState(false)
  const [isConfirmEmail, setIsConfirmEmail] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)
  const router = useRouter()
  const {
    register,
    watch,
    reset,
    handleSubmit,
    getValues,
    setFocus,
    setValue,
    resetField,
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

  const agreements = useAgreementStore((state: any) => state.agreements)

  console.log(agreements, '//////form page')

  const handleSubmitForm = async (data: SignUpFormSchemaType) => {
    //제3자동의 여부 체크
    if (!agreements) {
      toast('제 3자 동의 데이터가 누락되었습니다. 동의서를 작성해주세요.')
      return
    }

    //중복검사 체크 (ID, Email)
    if (!getValues('confirm_id')) {
      toast('ID 중복검사를 해주세요')
      return
    }

    if (!getValues('confirm_email')) {
      toast('Email 중복검사를 해주세요')
      return
    }

    setIsFormLoading(true)

    toast.promise(
      async () =>
        await await fetch(`/api/signUp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_type: data.user_type,
            name: data.name,
            id: data.id,
            email: data.email,
            password: data.password,
          }),
        }),
      {
        loading: '데이터 전송 중입니다.',
        success: () => {
          reset()
          router.refresh()
          return `회원가입이 완료되었습니다. 🎉`
        },
        error: (err) => {
          console.log(err)
          return `${err}`
        },
        finally: () => {
          setIsFormLoading(false)
          router.refresh()
        },
      },
    )
  }

  const confirmDuplicate = async (field_name: string, new_value: string) => {
    try {
      const response = await confirmDuplicateData({ field_name, new_value })

      console.log(response)

      if (!response) return

      handleDuplicateResponse(response)
    } catch (error) {
      console.error('Error confirming duplicate:', error)
    }
  }

  const handleDuplicateResponse = (response: any) => {
    const { field_name, success } = response

    switch (field_name) {
      case 'id':
        setIsConfirmID(success)
        if (!success) {
          toast('이미 존재하는 ID입니다.')
        }
        break
      case 'email':
        setIsConfirmEmail(success)
        if (!success) {
          toast('이미 존재하는 email입니다.')
        }
        break
      default:
        console.warn('알 수 없는 필드:', field_name)
    }
  }

  useEffect(() => {}, [watch, setFocus])

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
      <Toaster position="top-center" />
      <h1>회원가입 페이지</h1>
      <p>누구나 접근 가능한 화면</p>

      {isFormLoading ? (
        <h1>Loading...</h1>
      ) : (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <legend>회원가입 Form</legend>

          <HookFormRadioList register={register('user_type')} itemList={radioDataList} label={'user_type'} name={'user_type'} type={'radio'} />

          <div>
            <HookFormInput register={register('name')} id={'name'} label={'name'} type={'text'} placeholder={'name'} />
            <p>{errors.name && !!watch('name') && `${errors.name.message}`}</p>
          </div>

          <div>
            <HookFormInput register={register('id')} id={'id'} label={'id'} type={'text'} placeholder={'id'} disabled={isConfirmID} />

            <input
              {...register('confirm_id')}
              id={'confirm_id'}
              type="checkbox"
              name="confirm_id"
              checked={isConfirmID}
              disabled={!!errors.id || getValues('id') === '' || isConfirmID}
              onClick={() => confirmDuplicate('id', getValues('id'))}
            />
            {isConfirmID && (
              <button
                onClick={() => {
                  setValue('confirm_id', undefined)
                  setIsConfirmID(false)
                  resetField('id')

                  //Focus Error 대처
                  window.setTimeout(() => document.getElementById('id')?.focus(), 0)
                }}
              >
                수정
              </button>
            )}

            <p>{isConfirmID && '사용 가능한 아이디입니다.'}</p>
            <p>{errors.id && !!watch('id') && `${errors.id.message}`}</p>
          </div>

          <div>
            <HookFormInput register={register('email')} id={'email'} label={'email'} type={'email'} placeholder={'email'} />

            <input
              {...register('confirm_email')}
              id={'confirm_email'}
              type="checkbox"
              name="confirm_email"
              checked={isConfirmEmail}
              disabled={!!errors.email || getValues('email') === '' || isConfirmEmail}
              onClick={() => confirmDuplicate('email', getValues('email'))}
            />

            {isConfirmEmail && (
              <button
                onClick={() => {
                  setValue('confirm_email', undefined)
                  setIsConfirmEmail(false)
                  resetField('email')

                  //Focus Error 대처
                  window.setTimeout(() => document.getElementById('email')?.focus(), 0)
                }}
              >
                수정
              </button>
            )}

            <p>{isConfirmEmail && '사용 가능한 이메일입니다.'}</p>
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
            <p>{errors.password_confirm && !!watch('password_confirm') && `${errors.password_confirm.message}`}</p>
          </div>

          <button>submit</button>
        </form>
      )}

      <button onClick={() => router.back()}>뒤로</button>
    </>
  )
}
