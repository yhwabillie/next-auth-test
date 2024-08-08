'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { HookFormInput } from './HookFormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, Suspense, useEffect, useState } from 'react'
import { SignUpFormSchemaType, SignUpSchema } from '../zodSchema'
import { toast, Toaster } from 'sonner'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { confirmDuplicateData } from '@/app/actions/signUp/confirmData'
import { useAgreementStore } from '../zustandStore'
import Image from 'next/image'
import axios from 'axios'
import { HookFormCheckBox } from './HookFormCheckBox'
import { Button } from './Button'
import { HookFormRadioItem } from './HookFormRadioItem'
require('dotenv').config()

interface AgreementItemType {
  type: string
  agreed: boolean | undefined
}

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

    const agreementTypes: AgreementItemType[] = [
      {
        type: 'SERVICE',
        agreed: agreements.service_agreement,
      },
      {
        type: 'PRIVACY',
        agreed: agreements.privacy_agreement,
      },
      {
        type: 'MARKETING',
        agreed: agreements.selectable_agreement,
      },
    ]

    const agreementArr: AgreementItemType[] = []

    agreementTypes.forEach((item) => {
      agreementArr.push({
        type: item.type,
        agreed: item.agreed,
      })
    })

    const inputData = {
      user_type: data.user_type,
      name: data.name,
      id: data.id,
      email: data.email,
      password: data.password,
      agreements: agreementArr,
    }

    const blob = new Blob([JSON.stringify(inputData)], {
      type: 'application/json',
    })

    formData.append('input_data', blob)
    formData.append('profile_img', data.profile_img[0])

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
          router.push('/')
          return `회원가입이 완료되었습니다. 🎉`
        },
        error: (err) => {
          console.log(err)
          return `${err}`
        },
        finally: () => {},
      },
    )
  }

  const handleDuplicateResponse = (response: { field_name: string; success: boolean }) => {
    const { field_name, success } = response

    switch (field_name) {
      case 'id':
        setIsConfirmID(success)
        if (!success) {
          resetField('id')
          setFocus('id')
          toast('이미 존재하는 ID입니다.')
        }
        break
      case 'email':
        setIsConfirmEmail(success)
        if (!success) {
          resetField('email')
          setFocus('email')
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

  useEffect(() => {
    setFocus('name')
  }, [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form onSubmit={handleSubmit(handleSubmitForm)} encType="multipart/form-data" className="flex flex-col items-center justify-center gap-10">
        <legend className="sr-only">회원가입 폼</legend>
        <div className="relative mx-auto w-fit">
          <div className="relative h-[200px] w-[200px] overflow-hidden rounded-[50%] border border-gray-300 shadow-lg">
            <Image
              src={profileImage === '' ? '/images/default_profile.jpeg' : profileImage}
              alt="profile image"
              priority
              fill
              className="object-cover"
              sizes="200"
            />
          </div>
          <label
            htmlFor="profile_img"
            className="absolute bottom-0 right-0 flex h-14 w-14 cursor-pointer items-center justify-center rounded-[50%] border border-gray-300/50 bg-white shadow-lg hover:border-gray-500"
          >
            <span className="sr-only">프로필 이미지 업로드 버튼</span>
            <HiOutlinePencilSquare className="text-2xl text-gray-700" />
          </label>
          <input
            {...register('profile_img')}
            id="profile_img"
            name="profile_img"
            type="file"
            accept="image/png, image/jpeg, image/webp, image/jpg"
            onChange={handleChangeProfileImage}
          />
        </div>

        <fieldset className="w-[400px]">
          <legend className="mb-2 text-center text-lg font-medium tracking-tighter text-blue-400">사용자 타입을 선택해주세요</legend>
          <div className="mb-20 flex flex-row justify-center gap-3">
            <HookFormRadioItem
              register={register('user_type')}
              id="indivisual"
              value="indivisual"
              name="user_type"
              checked={watch('user_type') === 'indivisual'}
            />
            <HookFormRadioItem register={register('user_type')} id="admin" value="admin" name="user_type" checked={watch('user_type') === 'admin'} />
          </div>
          <div className="mb-6">
            <legend className="mb-2 text-center text-lg font-medium tracking-tighter text-blue-400">사용자 정보를 입력해주세요</legend>
            <HookFormInput register={register('name')} error={errors.name} id="name" label="사용자 이름" type="text" />
            {errors.name && !!watch('name') && <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="mb-6">
            <div className="flex h-fit w-fit flex-col">
              <HookFormInput register={register('id')} error={errors.id} id="id" label="아이디" type="text" disabled={isConfirmID} />

              {isConfirmID ? (
                <>
                  <button
                    onClick={() => {
                      setValue('confirm_id', undefined)
                      setIsConfirmID(false)
                      resetField('id')

                      //Focus Error 대처
                      window.setTimeout(() => document.getElementById('id')?.focus(), 0)
                    }}
                    className="mt-2 h-10 rounded-md bg-blue-400 text-white shadow-md hover:bg-blue-500"
                  >
                    수정
                  </button>
                  <label className="mt-2 pl-2 text-left text-sm text-blue-400">사용 가능한 아이디입니다.</label>
                </>
              ) : (
                <input
                  {...register('confirm_id')}
                  id={'confirm_id'}
                  type="checkbox"
                  name="confirm_id"
                  checked={isConfirmID}
                  disabled={!!errors.id || getValues('id') === '' || isConfirmID}
                  onClick={() => confirmDuplicate('id', getValues('id'))}
                  className="mt-2 h-10 w-full cursor-pointer rounded-md bg-blue-400 pt-2 text-center text-white shadow-md before:content-['중복검사'] hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-600/50"
                />
              )}
            </div>

            {errors.id && !!watch('id') && <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.id.message}</p>}
          </div>
          <div className="mb-6">
            <div className="flex h-fit w-fit flex-col">
              <HookFormInput register={register('email')} error={errors.email} id="email" label="이메일" type="email" disabled={isConfirmEmail} />

              {isConfirmEmail ? (
                <>
                  <button
                    onClick={() => {
                      setValue('confirm_email', undefined)
                      setIsConfirmEmail(false)
                      resetField('email')

                      //Focus Error 대처
                      window.setTimeout(() => document.getElementById('email')?.focus(), 0)
                    }}
                    className="mt-2 h-10 rounded-md bg-blue-400 text-white shadow-md hover:bg-blue-500"
                  >
                    수정
                  </button>
                  <p className="mt-2 pl-2 text-left text-sm text-blue-400">사용 가능한 이메일입니다.</p>
                </>
              ) : (
                <input
                  {...register('confirm_email')}
                  id="confirm_email"
                  type="checkbox"
                  name="confirm_email"
                  checked={isConfirmEmail}
                  disabled={!!errors.email || getValues('email') === '' || isConfirmEmail}
                  onClick={() => confirmDuplicate('email', getValues('email'))}
                  className="mt-2 h-10 w-full cursor-pointer rounded-md bg-blue-400 pt-2 text-center text-white shadow-md before:content-['중복검사'] hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-600/50"
                />
              )}

              {errors.email && !!watch('email') && <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>
          <div className="mb-4">
            <HookFormInput register={register('password')} error={errors.password} id="password" label="비밀번호" type="password" />
            <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.password && !!watch('password') && `${errors.password.message}`}</p>
          </div>
          <div>
            <HookFormInput
              register={register('password_confirm')}
              error={errors.password_confirm}
              id="password_confirm"
              label="비밀번호 확인"
              type="password"
            />
            <p className="mt-2 pl-2 text-left text-sm text-red-500">
              {errors.password_confirm && !!watch('password_confirm') && `${errors.password_confirm.message}`}
            </p>
          </div>
        </fieldset>

        <div className="flex w-[194px] justify-center gap-3">
          <Button label="이전" clickEvent={() => router.back()} type="button" />
          <Button label="제출하기" disalbe={!(Object.keys(errors).length === 0 && isConfirmEmail && isConfirmID)} />
        </div>
      </form>
    </Suspense>
  )
}
