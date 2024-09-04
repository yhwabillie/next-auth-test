import { IProfileFetchData, ProfileForm } from '@/lib/components/common/ProfileForm'
import dotenv from 'dotenv'
import { fetchProfileData } from '../actions/profile/fetchProfile'
import { headers } from 'next/headers'
import { Metadata } from 'next'
dotenv.config()

export const metadata: Metadata = {
  title: '회원정보관리',
}

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
      <header className="mb-1">
        <h3 className="mb-2 block text-center text-2xl font-semibold tracking-tighter text-gray-700">회원정보 관리</h3>
        <p className="text-center text-sm tracking-tighter text-gray-700 md:text-[16px] md:leading-6">회원정보를 업데이트하고 관리합니다.</p>
      </header>
      <main>
        <ProfileForm data={userData as IProfileFetchData} />
      </main>
    </section>
  )
}
