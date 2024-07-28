'use client'
import { updateUserAgreement, updateUserName, updateUserProfile } from '@/app/actions/profile/updateProfile'
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AgreementSchemaType, SignUpFormSchemaType, SignUpSchema } from '@/lib/zodSchema'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import axios from 'axios'

interface IFetchProfileData extends SignUpFormSchemaType, AgreementSchemaType {
  idx: string
  profile_img: string
}

interface IProfileFormProps {
  data: IFetchProfileData
}

enum ModalTypes {
  NONE = 'NONE',
  SERVICE = 'SERVICE',
  PRIVACY = 'PRIVACY',
  SELECTABLE = 'SELECTABLE',
}

export const ProfileForm = (props: IProfileFormProps) => {
  const { data: session, status, update } = useSession()
  const [profileImage, setProfileImage] = useState('')
  const {
    register,
    resetField,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IFetchProfileData>({
    mode: 'onChange',
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      user_type: props.data.user_type,
      name: props.data.name,
      id: props.data.id,
      email: props.data.email,
      service_agreement: props.data.service_agreement,
      privacy_agreement: props.data.privacy_agreement,
      selectable_agreement: props.data.selectable_agreement,
    },
  })

  const [activeModal, setActiveModal] = useState(ModalTypes.NONE)
  const openModal = (type: ModalTypes) => setActiveModal(type)
  const closeModal = () => setActiveModal(ModalTypes.NONE)

  const nameRef = useRef<HTMLInputElement>(null)
  const saveNameBtnRef = useRef<HTMLButtonElement>(null)

  const handleUpdateUserName = async () => {
    if (!session?.user?.name) return

    if (watch('name') === session.user.name) {
      toast.warning('변경하려는 이름과 기존이름이 동일합니다.')
      return
    }

    try {
      const response = await updateUserName(props.data.idx, getValues('name'))
      if (!response) {
        toast.error('사용자 이름 업데이트에 실패했습니다. 다시 시도해주세요.')
        return
      }

      if (status === 'authenticated') {
        update({ name: getValues('name') })
        toast.success('사용자 이름을 업데이트하였습니다.')
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const handleUpdateUserAgreement = async () => {
    const response = await updateUserAgreement({
      idx: props.data.idx,
      selectable_agreement: getValues('selectable_agreement')!,
    })

    if (response.success) {
      toast.success('이용정보 동의 업데이트가 완료되었습니다.')

      if (!nameRef.current) return
      nameRef.current.disabled = true
    } else {
      alert('Failed to update agreements')
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
    else if (props.data.profile_img !== 'undefined') {
      return props.data.profile_img
    }

    return '/images/default_profile.jpeg'
  }

  const handleUpdateProfile = async () => {
    const currentProfileImage = getValues('profile_img')

    const formData = new FormData()

    if (!currentProfileImage) {
      formData.append('profile_img', currentProfileImage)
    } else {
      formData.append('profile_img', currentProfileImage[0])
    }

    try {
      const response = await updateUserProfile(props.data.id, formData)
      if (!response) {
        toast.error('사용자 프로필 업데이트에 실패했습니다. 다시 시도해주세요.')
        return
      }

      if (status === 'authenticated') {
        update({ profile_img: response })
        toast.success('프로필 이미지가 업데이트되었습니다.')
        resetField('profile_img')
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

  return (
    <>
      <form>
        <legend>프로필 정보</legend>
        <fieldset>
          <legend>프로필 이미지</legend>
          <label>프로필 이미지: </label>

          <Image src={setPreviewImage()} width={200} height={200} alt="profile image" priority />

          <input
            {...register('profile_img')}
            id="profile_img"
            name="profile_img"
            type="file"
            accept="image/png, image/jpeg, image/webp, image/jpg"
            onChange={handleChangeProfileImage}
          />
          <button type="button" onClick={handleResetProfile}>
            기본 프로필
          </button>
          <button type="button" onClick={handleUpdateProfile} disabled={profileImage === ''}>
            프로필 이미지 업데이트
          </button>
        </fieldset>
        <fieldset>
          <legend>사용자 타입</legend>
          <label>사용자 타입: </label>
          <input {...register('user_type')} type="text" disabled={true} />
        </fieldset>
        <fieldset>
          <legend>사용자 아이디</legend>
          <label>ID: </label>
          <input {...register('id')} type="text" disabled={true} />
        </fieldset>
        <fieldset>
          <legend>사용자 이름</legend>
          <label>이름: </label>
          <div>
            <input {...register('name')} id="name" type="text" />
            <button
              type="button"
              ref={saveNameBtnRef}
              onClick={handleUpdateUserName}
              disabled={(errors.name && !!watch('name')) || watch('name') === ''}
            >
              저장
            </button>
          </div>

          <p>{errors.name && !!watch('name') && `${errors.name.message}`}</p>
        </fieldset>
        <fieldset>
          <legend>사용자 이메일</legend>
          <label>이메일: </label>
          <input {...register('email')} id="email" type="email" disabled={true} />
        </fieldset>

        <fieldset>
          <legend>이용동의 상태 (필수)</legend>
          <div>
            <label>service_agreement</label>
            <input {...register('service_agreement')} id="service_agreement" type="checkbox" disabled={true} />
            <button type="button" onClick={() => openModal(ModalTypes.SERVICE)}>
              전문보기
            </button>
          </div>
          <div>
            <label>privacy_agreement</label>
            <input {...register('privacy_agreement')} id="privacy_agreement" type="checkbox" disabled={true} />
            <button type="button" onClick={() => openModal(ModalTypes.PRIVACY)}>
              전문보기
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>이용동의 상태 (선택)</legend>
          <div>
            <label>selectable_agreement</label>
            <input {...register('selectable_agreement')} id="selectable_agreement" type="checkbox" />
            <button type="button" onClick={() => openModal(ModalTypes.SELECTABLE)}>
              전문보기
            </button>
          </div>
          <button type="button" onClick={handleUpdateUserAgreement}>
            이용동의 정보 업데이트
          </button>
        </fieldset>
      </form>

      {/* Modal */}
      {activeModal === ModalTypes.SERVICE && (
        <div>
          <h1>SERVICE</h1>
          <div>
            <h2>service_agreement</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </p>
          </div>
          <button onClick={closeModal}>닫기</button>
        </div>
      )}

      {activeModal === ModalTypes.PRIVACY && (
        <div>
          <h1>PRIVACY</h1>
          <div>
            <h2>service_agreement</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </p>
          </div>
          <button onClick={closeModal}>닫기</button>
        </div>
      )}

      {activeModal === ModalTypes.SELECTABLE && (
        <div>
          <h1>SELECTABLE</h1>
          <div>
            <h2>service_agreement</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </p>
          </div>
          <button onClick={closeModal}>닫기</button>
        </div>
      )}
    </>
  )
}
