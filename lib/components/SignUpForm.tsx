'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { SignUpFormSchemaType, SignUpSchema } from '../zodSchema'
import { HookFormRadioList, RadioItemType } from './HookFormRadio'
import { toast, Toaster } from 'sonner'
import { confirmDuplicateData } from '@/app/actions/signUp/confirmData'
import { useAgreementStore } from '../zustandStore'
import Image from 'next/image'
import axios from 'axios'
require('dotenv').config()

export const SignUpForm = () => {
  const [profileImage, setProfileImage] = useState('')
  const [isConfirmID, setIsConfirmID] = useState(false)
  const [isConfirmEmail, setIsConfirmEmail] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
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

  const agreements = useAgreementStore((state) => state.agreements)

  const handleSubmitForm = async (data: SignUpFormSchemaType) => {
    //제3자동의 여부 체크
    if (!agreements) {
      toast('동의 데이터가 누락되었습니다. 동의서를 작성해주세요.')
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

    const formData = new FormData()

    const inputData = {
      user_type: data.user_type,
      name: data.name,
      id: data.id,
      email: data.email,
      password: data.password,
      service_agreement: agreements.service_agreement,
      privacy_agreement: agreements.privacy_agreement,
      selectable_agreement: agreements?.selectable_agreement,
    }

    const blob = new Blob([JSON.stringify(inputData)], {
      type: 'application/json',
    })

    formData.append('input_data', blob)
    formData.append('profile_image', data.profile_image[0])

    setIsFormLoading(true)

    toast.promise(
      axios({
        method: 'post',
        url: `/api/signUp`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
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

  const handleDuplicateResponse = (response: { field_name: string; success: boolean }) => {
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

  const confirmDuplicate = async (field_name: string, new_value: string) => {
    try {
      const response = await confirmDuplicateData({ field_name, new_value })

      if (!response) return
      handleDuplicateResponse(response)
    } catch (error) {
      console.error('Error confirming duplicate:', error)
    }
  }

  const handleChangeProfileImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    if (event.target.files.length > 0) {
      const currentImage = event.target.files[0]

      const reader = new FileReader()
      reader.readAsDataURL(currentImage)

      reader.onload = (event: ProgressEvent<FileReader>) => {
        //Base64 Data URL onload status 2완료 1진행중 0실패
        if (!event.target) return

        if (reader.readyState === FileReader.DONE) {
          const imgUrl = event.target?.result as string

          setProfileImage(imgUrl)
        }
      }
    } else {
      setProfileImage('')
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
        <form onSubmit={handleSubmit(handleSubmitForm)} encType="multipart/form-data">
          <legend>회원가입 Form</legend>

          <fieldset>
            <legend>프로필 이미지</legend>
            <Image src={profileImage === '' ? '/images/default_profile.jpeg' : profileImage} width={200} height={200} alt="profile image" priority />
            <input
              {...register('profile_image')}
              id="profile_image"
              name="profile_image"
              type="file"
              accept="image/png, image/jpeg, image/webp, image/jpg"
              onChange={handleChangeProfileImage}
            />
          </fieldset>

          <HookFormRadioList register={register('user_type')} itemList={radioDataList} label="user_type" name="user_type" type="radio" />

          <div>
            <HookFormInput register={register('name')} id="name" label="name" type="text" placeholder="name" />
            <p>{errors.name && !!watch('name') && `${errors.name.message}`}</p>
          </div>

          <div>
            <HookFormInput register={register('id')} id="id" label="id" type="text" placeholder="id" disabled={isConfirmID} />

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
            <HookFormInput register={register('email')} id="email" label="email" type="email" placeholder="email" />

            <input
              {...register('confirm_email')}
              id="confirm_email"
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
            <HookFormInput register={register('password')} id="password" label="password" type="password" placeholder="password" />
            <p>{errors.password && !!watch('password') && `${errors.password.message}`}</p>
          </div>

          <div>
            <HookFormInput
              register={register('password_confirm')}
              id="password_confirm"
              label="password_confirm"
              type="password"
              placeholder="password_confirm"
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
