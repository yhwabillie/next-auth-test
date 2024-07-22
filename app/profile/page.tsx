'use server'
import { ProfileForm } from '@/lib/components/ProfileForm'
import { headers } from 'next/headers'

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      headers: headers(),
    })

    if (!response.ok) return
    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export default async function Page() {
  const data = await fetchData()

  return <ProfileForm data={data} />
}
