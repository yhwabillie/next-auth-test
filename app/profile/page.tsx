'use server'
import { IProfileFetchData, ProfileForm } from '@/lib/components/ProfileForm'
import dotenv from 'dotenv'
import { fetchProfileData } from '../actions/profile/fetchProfile'
import { headers } from 'next/headers'
dotenv.config()

export default async function Page() {
  // headers를 사용하여 Server Actions에서 요청 객체를 전달할 수 있습니다.
  const req = {
    headers: headers(),
  }

  let userData

  try {
    userData = await fetchProfileData(req)
  } catch (error) {
    console.error(error)
    userData = null
  }

  if (!userData) {
    return <div>Error: Unable to fetch user data</div>
  }

  console.log(userData, '///')

  userData

  return (
    <>
      <h1>프로필 페이지</h1>
      <p>권한있는 사용자만 접근할 수 있습니다.</p>
      <ProfileForm data={userData as IProfileFetchData} />
    </>
  )
}
