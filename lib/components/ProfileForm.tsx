'use client'
import { useRouter } from 'next/navigation'

export const ProfileForm = (props: any) => {
  const router = useRouter()
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
          <input type="text" value={props.data.users.name} disabled={true} />
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
