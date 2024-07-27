'use server'
import { ProfileForm } from '@/lib/components/ProfileForm'
import { headers } from 'next/headers'
import dotenv from 'dotenv'
dotenv.config()

const fetchProfileData = async () => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
      method: 'GET',
      headers: new Headers(headers()),
    })

    if (!response.ok) {
      throw Error('사용자 프로필 정보 Fetch Error')
    }

    return await response.json()
  } catch (error) {
    console.error('사용자 프로필 정보 Fetch Error :', error)
    return null
  }
}

export default async function Page() {
  const data = await fetchProfileData()

  return <ProfileForm data={data} />
}
