'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
      <h1 className="font-display text-2xl font-bold text-gray-900">Welcome back</h1>
      <p className="mt-2 text-sm text-gray-600">Log in to access your blueprints.</p>
      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input label="Email" name="email" type="email" required />
        <Input label="Password" name="password" type="password" required />
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Logging in...' : 'Log In'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">No account? <Link href="/signup" className="font-medium text-brand-600">Sign up</Link></p>
      <p className="mt-2 text-center text-sm"><Link href="/forgot-password" className="text-gray-500">Forgot password?</Link></p>
    </div>
  )
}
