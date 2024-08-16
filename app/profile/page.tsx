'use server'
import { IProfileFetchData, ProfileForm } from '@/lib/components/common/ProfileForm'
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
    <section aria-labelledby="page-heading" className="min-h-full px-5 py-10">
      <h2 id="page-heading" className="sr-only">
        회원정보 관리 본문
      </h2>
      <header>
        <h3 className="mb-4 block text-center text-2xl font-semibold text-gray-700">📌 회원정보 관리</h3>
        <p className="text-center">회원정보를 업데이트하고 관리합니다.</p>
      </header>
      <main>
        <ProfileForm data={userData as IProfileFetchData} />
      </main>
    </section>
  )
}
