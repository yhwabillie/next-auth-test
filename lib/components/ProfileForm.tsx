'use client'
import { updateUserAgreement, updateUserName } from '@/app/actions/profile/updateProfile'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export const ProfileForm = (props: any) => {
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, getValues, reset } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      service_agreement: props.data.users.service_agreement,
      privacy_agreement: props.data.users.privacy_agreement,
      selectable_agreement: props.data.users.selectable_agreement,
    },
  })
  const [serviceAgreement, setServiceAgreement] = useState(false)
  const [privacyAgreement, setPrivacyAgreement] = useState(false)
  const [selectableAgreement, setSelectableAgreement] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)

  const handleUpdateUserName = async () => {
    if (!nameRef.current) return

    const newName = nameRef.current.value
    const response = await updateUserName({ idx: props.data.users.idx, new_name: newName })

    if (response.success) {
      alert('Username updated successfully')

      if (!nameRef.current) return
      nameRef.current.disabled = true
    } else {
      alert('Failed to update username')
    }
  }

  const handleUpdateUserAgreement = async () => {
    const response = await updateUserAgreement({
      idx: props.data.users.idx,
      selectable_agreement: getValues('selectable_agreement'),
    })

    if (response.success) {
      toast('이용정보 동의 업데이트가 완료되었습니다.')

      if (!nameRef.current) return
      nameRef.current.disabled = true
    } else {
      alert('Failed to update agreements')
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <h1>프로필 페이지</h1>
      <p>권한있는 사용자만 접근할 수 있습니다.</p>

      <form>
        <legend>프로필 정보</legend>
        <fieldset>
          <legend>프로필 이미지</legend>
          <label>프로필 이미지: </label>
          <input type="file" />
          <Image
            src={props.data.users.profile_img ? props.data.users.profile_img : '/images/default_profile.jpeg'}
            width={200}
            height={200}
            alt="profile image"
            priority
          />
        </fieldset>
        <fieldset>
          <legend>사용자 타입</legend>
          <label>사용자 타입: </label>
          <input type="text" value={props.data.users.user_type} disabled={true} />
        </fieldset>
        <fieldset>
          <legend>사용자 아이디</legend>
          <label>ID: </label>
          <input type="text" value={props.data.users.id} disabled={true} />
        </fieldset>
        <fieldset>
          <legend>사용자 이름</legend>
          <label>이름: </label>
          <input {...register('name')} ref={nameRef} id="name" type="text" defaultValue={props.data.users.name} disabled={true} />
          <button
            onClick={(e) => {
              e.preventDefault()

              if (!nameRef.current) return
              nameRef.current.disabled = false
              nameRef.current.selectionStart = props.data.users.name.length
              nameRef.current.focus()
            }}
          >
            수정
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()

              handleUpdateUserName()
            }}
          >
            저장
          </button>
        </fieldset>
        <fieldset>
          <legend>사용자 이메일</legend>
          <label>이메일: </label>
          <input type="email" value={props.data.users.email} disabled={true} />
        </fieldset>

        <fieldset>
          <legend>이용동의 상태 (필수)</legend>
          <div>
            <label>service_agreement</label>
            <input {...register('service_agreement')} id="service_agreement" type="checkbox" disabled={true} />
            <button
              type="button"
              onClick={() => {
                setServiceAgreement(true)
              }}
            >
              전문보기
            </button>
          </div>
          <div>
            <label>privacy_agreement</label>
            <input {...register('privacy_agreement')} id="privacy_agreement" type="checkbox" disabled={true} />
            <button
              type="button"
              onClick={() => {
                setServiceAgreement(true)
              }}
            >
              전문보기
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>이용동의 상태 (선택)</legend>
          <div>
            <label>selectable_agreement</label>
            <input {...register('selectable_agreement')} id="selectable_agreement" type="checkbox" />
            <button
              type="button"
              onClick={() => {
                setServiceAgreement(true)
              }}
            >
              전문보기
            </button>
          </div>
          <button type="button" onClick={handleUpdateUserAgreement}>
            이용동의 정보 업데이트
          </button>
        </fieldset>
      </form>

      {/* Modal */}
      {serviceAgreement && (
        <div>
          <h1>레이어 모달창1</h1>
          <div>
            <h2>service_agreement</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio ipsa ab harum enim beatae! Eius voluptates magni dolorum cum. Magnam
              accusamus commodi impedit deserunt optio, incidunt eius consequuntur omnis illum.
            </p>
          </div>
          <button onClick={() => setServiceAgreement(false)}>닫기</button>
        </div>
      )}
    </>
  )
}
