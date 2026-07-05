'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
      <h1 className="font-display text-2xl font-bold text-gray-900">Reset password</h1>
      {sent ? (
        <p className="mt-4 text-sm text-green-600">Check your email for a reset link.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-gray-600">Enter your email and we&apos;ll send you a reset link.</p>
          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input label="Email" name="email" type="email" required />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send Reset Link'}</Button>
          </form>
        </>
      )}
    </div>
  )
}
