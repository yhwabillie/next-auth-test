'use client'
import { confirmCurrentPw, updateUserAgreement, updateUserName, updateUserProfile, updateUserPw } from '@/app/actions/profile/updateProfile'
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AgreementSchemaType, SignUpFormSchemaType, SignUpSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut, useSession } from 'next-auth/react'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { Button } from './modules/Button'
import { HookFormInput } from '@/lib/components/common/modules/HookFormInput'
import { HookFormCheckBox } from '@/lib/components/common/modules/HookFormCheckBox'
import { useRouter } from 'next/navigation'
import { useModalStore } from '@/lib/zustandStore'
import { TbRestore } from 'react-icons/tb'
import dayjs from 'dayjs'
import 'dayjs/locale/ko' // 한국어 로케일 불러오기
import { SkeletonProfile } from './SkeletonProfile'
import clsx from 'clsx'
dayjs.locale('ko') // 한국어 로케일 설정

interface IProfileFormData extends SignUpFormSchemaType, AgreementSchemaType {
  idx: string
  profile_img: string
  input_password: string
}

export interface IProfileFetchData {
  profile_img: string
  user_type: 'indivisual' | 'admin'
  name: string
  id: string
  email: string
  password: string
  agreements: any
  idx: string
}

enum ModalTypes {
  NONE = 'NONE',
  SERVICE = 'SERVICE',
  PRIVACY = 'PRIVACY',
  SELECTABLE = 'SELECTABLE',
}

export const ProfileForm = ({ data }: { data: IProfileFetchData }) => {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [profileImage, setProfileImage] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [nameLoading, setNameLoading] = useState(false)
  const [currentPwLoading, setCurrentPwLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [selectableLoading, setSelectableLoading] = useState(false)
  const [confirmedPW, setConfirmedPW] = useState(false)
  const {
    register,
    resetField,
    setValue,
    watch,
    getValues,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<IProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      user_type: data.user_type,
      name: data.name,
      id: data.id,
      email: data.email,
      password_confirm: '',
      service_agreement: data.agreements[0].agreed,
      privacy_agreement: data.agreements[1].agreed,
      selectable_agreement: data.agreements[2].agreed,
    },
  })

  const [activeModal, setActiveModal] = useState(ModalTypes.NONE)
  const { setModalState } = useModalStore((state) => state)

  const openModal = (type: ModalTypes) => {
    setModalState(true)
    setActiveModal(type)
  }
  const closeModal = () => {
    setModalState(false)
    setActiveModal(ModalTypes.NONE)
  }

  const nameRef = useRef<HTMLInputElement>(null)
  const saveNameBtnRef = useRef<HTMLButtonElement>(null)

  const handleUpdateUserName = async () => {
    if (!session?.user?.name) return

    if (watch('name') === session.user.name) {
      toast.warning('변경하려는 이름과 기존이름이 동일합니다.')
      return
    }

    setNameLoading(true)

    try {
      const response = await updateUserName(data.idx, getValues('name'))
      if (!response) {
        toast.error('사용자 이름 업데이트에 실패했습니다. 다시 시도해주세요.')
        return
      }

      if (status === 'authenticated') {
        update({ name: getValues('name') })
        router.refresh()
        toast.success('사용자 이름을 업데이트하였습니다.')
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdateUserAgreement = async () => {
    setSelectableLoading(true)

    try {
      const response = await updateUserAgreement({
        agreementIdx: data.agreements[2].id,
        userIdx: data.idx,
        selectable_agreement: getValues('selectable_agreement')!,
      })

      if (response.success) {
        router.refresh()
        toast.success('이용정보 동의 업데이트가 완료되었습니다.')
        if (!nameRef.current) return
        nameRef.current.disabled = true
      }
    } catch (error) {
      toast.error('이용정보 동의 업데이트에 실패했습니다.')
    } finally {
      setSelectableLoading(false)
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

  const setPreviewImage = () => {
    // 이미지 변경시 프리뷰
    if (profileImage !== '') {
      return profileImage
    }

    // 기존 이미지 (커스텀 이미지 사용 케이스)
    else if (data.profile_img !== 'undefined') {
      return data.profile_img
    }

    return '/images/default_profile.jpeg'
  }

  const handleUpdateProfile = async () => {
    const currentProfileImage = getValues('profile_img')

    const formData = new FormData()

    setProfileLoading(true)

    if (!currentProfileImage) {
      formData.append('profile_img', currentProfileImage)
    } else {
      formData.append('profile_img', currentProfileImage[0])
    }

    try {
      const response = await updateUserProfile(data.id, formData)
      if (!response) {
        toast.error('사용자 프로필 업데이트에 실패했습니다. 다시 시도해주세요.')
        return
      }

      if (status === 'authenticated') {
        try {
          const updatedSession = await update({ profile_img: response })

          if (updatedSession) {
            router.refresh()
            resetField('profile_img')

            toast.success('프로필 이미지가 업데이트되었습니다.')
          }
        } catch (error: any) {
          toast.error(error)
        }
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const handleResetProfile = () => {
    // 기본 프로필로 세팅
    setProfileImage('/images/default_profile.jpeg')
    resetField('profile_img')
  }

  const handleConfirmCurrentPw = async () => {
    setCurrentPwLoading(true)

    try {
      const input_pw = getValues('input_password')
      const response = await confirmCurrentPw(data.idx, input_pw)

      if (response) {
        setConfirmedPW(response)
        toast.success('비밀번호가 확인되었습니다.')
      } else {
        resetField('input_password')
        setFocus('input_password')
        toast.error('비밀번호가 일치하지 않습니다, 다시 입력하세요.')
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setCurrentPwLoading(false)
    }
  }

  const handleUpdatePw = async () => {
    setPwLoading(true)

    try {
      const response = await updateUserPw(data.idx, getValues('password'))

      if (response) {
        resetField('password')
        resetField('password_confirm')

        // 비동기적으로 포커스 설정
        setTimeout(() => setFocus('password'), 100)

        toast.warning('기존 비밀번호와 동일합니다, 다른 비밀번호로 입력해주세요.')
      } else {
        setConfirmedPW(false)
        resetField('password')
        signOut({ callbackUrl: '/signIn' })
        toast.success('비밀번호가 업데이트 되었습니다. 재로그인 하세요')
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setPwLoading(false)
    }
  }

  useEffect(() => {
    setProfileLoading(false)
    setProfileImage('')
  }, [data.profile_img])

  return (
    <>
      <div className="mb-4 flex items-center justify-center gap-2 text-center">
        <h3 className="text-xl font-medium text-blue-400">{`${data.name}님은`}</h3>
        <p>{`${data.user_type === 'indivisual' ? '일반' : '관리자'} 사용자 입니다`}</p>
      </div>

      <form className="flex flex-col items-center justify-center gap-16">
        <legend className="sr-only">프로필 폼</legend>
        <fieldset className="flex flex-col items-center justify-center gap-14">
          <div className="relative mx-auto w-fit">
            {profileLoading && <SkeletonProfile />}

            <div className="relative h-[200px] w-[200px] overflow-hidden rounded-[50%] border border-gray-300 shadow-lg">
              <Image src={setPreviewImage()} alt="profile image" priority fill className="object-cover" sizes="200" />
            </div>
            <label
              htmlFor="profile_img"
              className="absolute bottom-0 right-0 flex h-14 w-14 cursor-pointer items-center justify-center rounded-[50%] border border-gray-300/50 bg-white shadow-lg hover:border-gray-500"
            >
              <span className="sr-only">프로필 이미지 변경</span>
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
          <div className="flex w-full flex-col gap-2">
            {data.profile_img !== 'undefined' && !profileLoading && <Button type="button" label="기본 프로필 선택" clickEvent={handleResetProfile} />}

            {profileImage !== '' && !profileLoading && (
              <button
                type="button"
                className="leading-1 flex h-[50px] w-full min-w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-secondary disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={profileLoading}
                onClick={() => {
                  setProfileImage('')
                }}
              >
                <TbRestore className="text-lg" />
                <span>되돌리기</span>
              </button>
            )}
            <Button
              type="button"
              label={`${profileLoading ? '업데이트 중...' : '프로필 이미지 업데이트'}`}
              clickEvent={handleUpdateProfile}
              disalbe={profileImage === '' || profileLoading}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="sr-only">사용자 상세 정보</legend>
          <div className="mb-4">
            <legend className="sr-only">사용자 아이디</legend>
            <HookFormInput register={register('id')} id="id" label="아이디" type="text" disabled={true} />
          </div>
          <div className="mb-10">
            <legend className="sr-only">사용자 이메일</legend>
            <HookFormInput register={register('email')} id="email" error={errors.email} label="이메일" type="email" disabled={true} />
          </div>
          <div className="mb-10">
            <legend className="sr-only">사용자 이름</legend>
            <div className="mb-2">
              <HookFormInput register={register('name')} id="name" error={errors.name} label="이름" type="text" disabled={nameLoading} />
            </div>
            <button
              type="button"
              ref={saveNameBtnRef}
              onClick={handleUpdateUserName}
              disabled={errors.name !== undefined || watch('name') === '' || nameLoading}
              className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-blue-400 py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {nameLoading ? '업데이트 중...' : '업데이트'}
            </button>
            {errors.name && !!watch('name') && <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {!confirmedPW ? (
            <div>
              <legend className="sr-only">비밀번호 변경</legend>
              <div className="mb-2">
                <HookFormInput
                  register={register('input_password')}
                  id="input_password"
                  error={errors.input_password}
                  label="비밀번호"
                  type="password"
                  placeholder="현재 비밀번호를 입력하세요"
                  disabled={currentPwLoading}
                />
                {errors.input_password && !!watch('input_password') && (
                  <p className="mt-2 pl-2 text-left text-sm text-red-500">{errors.input_password.message}</p>
                )}
              </div>
              <Button
                type="button"
                disalbe={watch('input_password') === '' || watch('input_password') === undefined || currentPwLoading}
                clickEvent={handleConfirmCurrentPw}
                label={`${currentPwLoading ? '비밀번호 확인 중...' : '현재 비밀번호 확인'}`}
                spinner={currentPwLoading}
              />
            </div>
          ) : (
            <>
              <div className="mb-2 mt-6">
                <HookFormInput
                  register={register('password')}
                  id="password"
                  error={errors.password}
                  label="신규 비밀번호"
                  type="password"
                  disabled={pwLoading}
                  autoFocus={true}
                />
                {errors.password && !!watch('password') && (
                  <p className="mt-2 w-[400px] pl-2 text-left text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="mb-10">
                <div className="mb-2">
                  <HookFormInput
                    register={register('password_confirm')}
                    id="password_confirm"
                    error={errors.password_confirm}
                    label="신규 비밀번호 확인"
                    type="password"
                    disabled={pwLoading}
                  />
                  {errors.password_confirm && !!watch('password_confirm') && (
                    <p className="mt-2 w-[400px] pl-2 text-left text-sm text-red-500">{errors.password_confirm.message}</p>
                  )}
                </div>

                <Button
                  type="button"
                  disalbe={Object.keys(errors).length > 0 || watch('password') === '' || watch('password_confirm') === '' || pwLoading}
                  clickEvent={handleUpdatePw}
                  label={`${pwLoading ? '업데이트 중...' : '비밀번호 업데이트'}`}
                />
              </div>
            </>
          )}

          <div className="mb-10 mt-10">
            <div className="mb-2">
              <strong className="text-md font-medium tracking-tighter text-blue-600/70">[필수] 서비스 이용 동의 상태: </strong>
              <span className="ml-2 inline-block font-semibold text-blue-600">동의</span>
            </div>
            <p className="mb-4 text-gray-600">동의 일시: {dayjs(data.agreements[0].updatedAt).format('YYYY년 MM월 DD일 A hh:mm:ss')}</p>

            <button
              type="button"
              onClick={() => openModal(ModalTypes.SERVICE)}
              className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-blue-700 py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-800"
            >
              전문보기
            </button>
          </div>
          <div className="mb-10">
            <div className="mb-2">
              <strong className="text-md font-medium tracking-tighter text-blue-600/70">[필수] 개인 정보 이용 동의 상태: </strong>
              <span className="ml-2 inline-block font-semibold text-blue-600">동의</span>
            </div>
            <p className="mb-4 text-gray-600">동의 일시: {dayjs(data.agreements[1].updatedAt).format('YYYY년 MM월 DD일 A hh:mm:ss')}</p>

            <button
              type="button"
              onClick={() => openModal(ModalTypes.PRIVACY)}
              className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-blue-700 py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-800"
            >
              전문보기
            </button>
          </div>
          <div className="mb-2">
            <div className="mb-2">
              <HookFormCheckBox
                register={register('selectable_agreement')}
                checked={watch('selectable_agreement')}
                onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const isChecked = event.target.checked
                  setValue('selectable_agreement', isChecked)
                }}
                id="selectable_agreement"
                label="마케팅 이용 동의 (선택)"
              />
            </div>

            <p className="mb-4 text-gray-600">마지막 업데이트 일시: {dayjs(data.agreements[2].updatedAt).format('YYYY년 MM월 DD일 A hh:mm:ss')}</p>

            <button
              type="button"
              onClick={() => openModal(ModalTypes.SELECTABLE)}
              className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-blue-700 py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-800"
            >
              전문보기
            </button>
          </div>
          <Button
            type="button"
            disalbe={data.agreements[2].agreed === getValues('selectable_agreement') || selectableLoading}
            clickEvent={handleUpdateUserAgreement}
            spinner={selectableLoading}
            label="정보 동의 업데이트"
          />
        </fieldset>
      </form>

      {/* Modal */}
      {activeModal === ModalTypes.SERVICE && (
        <div className="fixed left-0 top-0 z-[40] flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10 backdrop-blur-sm">
          <section className="mx-10 box-border flex min-h-full w-full flex-col justify-between rounded-2xl bg-white p-10 shadow-lg md:mx-0 md:max-w-[600px]">
            <h2 className="text-center text-2xl font-semibold tracking-tighter">서비스 이용 동의 (필수) 전문</h2>
            <div className="scroll-area my-4 h-[350px] flex-1 overflow-y-scroll break-all rounded-lg border border-gray-400/50 py-2 pl-2 shadow-md">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius
              consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates
              magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit
              deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum
              enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius
              consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates
              magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit
              deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum
              enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </div>

            <Button label="닫기" clickEvent={closeModal} />
          </section>
        </div>
      )}

      {activeModal === ModalTypes.PRIVACY && (
        <div className="fixed left-0 top-0 z-[40] flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10 backdrop-blur-sm">
          <section className="mx-10 box-border flex min-h-full w-full flex-col justify-between rounded-2xl bg-white p-10 shadow-lg md:mx-0 md:max-w-[600px]">
            <h2 className="text-center text-2xl font-semibold tracking-tighter">개인 정보 이용 동의 (필수) 전문</h2>
            <div className="scroll-area my-4 h-[350px] flex-1 overflow-y-scroll break-all rounded-lg border border-gray-400/50 py-2 pl-2 shadow-md">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius
              consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates
              magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit
              deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum
              enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius
              consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates
              magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit
              deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum
              enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </div>

            <Button label="닫기" clickEvent={closeModal} />
          </section>
        </div>
      )}

      {activeModal === ModalTypes.SELECTABLE && (
        <div className="fixed left-0 top-0 z-[40] flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10 backdrop-blur-sm">
          <section className="mx-10 box-border flex min-h-full w-full flex-col justify-between rounded-2xl bg-white p-10 shadow-lg md:mx-0 md:max-w-[600px]">
            <h2 className="text-center text-2xl font-semibold tracking-tighter">마케팅 이용 동의 (선택) 전문</h2>
            <div className="scroll-area my-4 h-[350px] flex-1 overflow-y-scroll break-all rounded-lg border border-gray-400/50 py-2 pl-2 shadow-md">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius
              consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates
              magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit
              deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum
              enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius
              consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates
              magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit
              deserunt optio, incidunt eius consequuntur omnis illum. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum
              enim beatae! Eius voluptates magni dolorum cum. Magnam accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </div>

            <Button label="닫기" clickEvent={closeModal} />
          </section>
        </div>
      )}
    </>
  )
}
