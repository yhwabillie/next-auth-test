'use server'
import { ProfileForm } from '@/lib/components/ProfileForm'
import { headers } from 'next/headers'
require('dotenv').config()

const fetchData = async () => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
    method: 'GET',
    headers: headers(),
  })

  if (!response.ok) return
  const data = await response.json()

  return data
}

export default async function Page() {
  const data = await fetchData()

  return <ProfileForm data={data} />
}
