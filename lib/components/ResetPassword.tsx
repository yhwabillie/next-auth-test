'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // useSearchParams는 클라이언트 사이드에서만 사용할 수 있습니다.
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('No token provided')
    }
  }, [token])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(result.message)
        setError('')
        // 비밀번호 재설정 후 원하는 페이지로 리디렉션
        // router.push('/login');
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred while resetting the password.')
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>Reset Password</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p>{message}</p>}
        {!message && (
          <form onSubmit={handleSubmit}>
            <label>
              New Password:
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </label>
            <label>
              Confirm Password:
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>
    </Suspense>
  )
}
