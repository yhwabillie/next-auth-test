'use client'
import { updateUserAgreement, updateUserName } from '@/app/actions/profile/updateProfile'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AgreementSchemaType, SignUpFormSchemaType } from '@/lib/zodSchema'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, getValues, reset } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      service_agreement: props.data.service_agreement,
      privacy_agreement: props.data.privacy_agreement,
      selectable_agreement: props.data.selectable_agreement,
    },
  })

  const [activeModal, setActiveModal] = useState(ModalTypes.NONE)
  const openModal = (type: ModalTypes) => setActiveModal(type)
  const closeModal = () => setActiveModal(ModalTypes.NONE)

  const nameRef = useRef<HTMLInputElement>(null)

  const handleUpdateUserName = async () => {
    if (!nameRef.current) return
    const newName = nameRef.current.value

    try {
      const response = await updateUserName({ idx: props.data.idx, new_name: newName })
      if (response.error) {
        toast.error('사용자 이름 업데이트에 실패했습니다. 다시 시도해주세요.')
      }

      if (response.success) {
        nameRef.current.disabled = true
        router.refresh()

        toast.success('사용자 이름을 업데이트하였습니다.')
      }
    } catch (error) {
      console.log(error)
      toast.error('사용자 이름 업데이트에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleUpdateUserAgreement = async () => {
    const response = await updateUserAgreement({
      idx: props.data.idx,
      selectable_agreement: getValues('selectable_agreement'),
    })

    if (response.success) {
      toast.success('이용정보 동의 업데이트가 완료되었습니다.')

      if (!nameRef.current) return
      nameRef.current.disabled = true
    } else {
      alert('Failed to update agreements')
    }
  }

  return (
    <>
      <h1>프로필 페이지</h1>
      <p>권한있는 사용자만 접근할 수 있습니다.</p>

      <form>
        <legend>프로필 정보</legend>
        <fieldset>
          <legend>프로필 이미지</legend>
          <label>프로필 이미지: </label>
          <input type="file" />
          <Image
            src={props.data.profile_img === 'undefined' ? '/images/default_profile.jpeg' : props.data.profile_img}
            width={200}
            height={200}
            alt="profile image"
            priority
          />
        </fieldset>
        <fieldset>
          <legend>사용자 타입</legend>
          <label>사용자 타입: </label>
          <input type="text" value={props.data.user_type} disabled={true} />
        </fieldset>
        <fieldset>
          <legend>사용자 아이디</legend>
          <label>ID: </label>
          <input type="text" value={props.data.id} disabled={true} />
        </fieldset>
        <fieldset>
          <legend>사용자 이름</legend>
          <label>이름: </label>
          <input {...register('name')} ref={nameRef} id="name" type="text" defaultValue={props.data.name} disabled={true} />
          <button
            onClick={(e) => {
              e.preventDefault()

              if (!nameRef.current) return
              nameRef.current.disabled = false
              nameRef.current.selectionStart = props.data.name.length
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
          <input type="email" value={props.data.email} disabled={true} />
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
