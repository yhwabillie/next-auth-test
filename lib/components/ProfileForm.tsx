'use client'
import { updateUserName } from '@/app/actions/profile/updateProfile'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

export const ProfileForm = (props: any) => {
  const router = useRouter()
  const { register, handleSubmit, watch, getValues, reset } = useForm<FieldValues>()
  const nameRef = useRef<HTMLInputElement>(null)
  const watchName = watch('name')

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

  return (
    <>
      <h1>프로필 페이지</h1>
      <p>권한있는 사용자만 접근할 수 있습니다.</p>

      <form>
        <legend>프로필 정보</legend>
        <fieldset>
          <label>사용자 타입: </label>
          <input type="text" value={props.data.users.user_type} disabled={true} />
        </fieldset>
        <fieldset>
          <label>ID: </label>
          <input type="text" value={props.data.users.id} disabled={true} />
        </fieldset>
        <fieldset>
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
          <label>이메일: </label>
          <input type="email" value={props.data.users.email} disabled={true} />
        </fieldset>
      </form>
      <button onClick={() => router.push('/')}>메인으로</button>
    </>
  )
}
