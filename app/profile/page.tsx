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
    userData = await fetchProfileData()
  } catch (error) {
    console.error(error)
    userData = null
  }

  if (!userData) {
    return <div>Error: Unable to fetch user data</div>
  }

  return (
    <section className="min-h-full px-5 py-10">
      <h2 className="mb-4 block text-center text-2xl font-semibold text-gray-700">📌 마이페이지</h2>
      <ProfileForm data={userData as IProfileFetchData} />
    </section>
  )
}
