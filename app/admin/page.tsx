import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
  if (!adminEmails.includes(session.user.email || '')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-500">You do not have admin access.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-brand-600">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const [{ count: totalUsers }, { count: totalProjects }, { count: totalPaid }, { data: payments }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
    supabase.from('payments').select('amount, currency, status, created_at, project_id').order('created_at', { ascending: false }).limit(10),
  ])

  const revenue = payments?.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0) || 0

  const { data: recentProjects } = await supabase.from('projects').select('business_name, business_type, status, payment_status, created_at').order('created_at', { ascending: false }).limit(10)

  const stats = [
    { label: 'Total Users', value: totalUsers || 0, icon: Users },
    { label: 'Total Projects', value: totalProjects || 0, icon: FileText },
    { label: 'Paid Projects', value: totalPaid || 0, icon: TrendingUp },
    { label: 'Revenue', value: `$${(revenue / 100).toFixed(2)}`, icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <h1 className="font-display text-lg font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/dashboard"><span className="text-sm text-brand-600">Back to User Dashboard</span></Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <s.icon className="mb-2 text-brand-500" size={20} />
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-semibold text-gray-900">Recent Projects</h2>
            {recentProjects && recentProjects.length > 0 ? (
              <div className="space-y-2">
                {recentProjects.map((p, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 py-2 text-sm">
                    <span className="font-medium text-gray-900">{p.business_name}</span>
                    <span className={p.payment_status === 'paid' ? 'text-green-600' : 'text-gray-400'}>{p.payment_status}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No projects yet.</p>}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-semibold text-gray-900">Recent Payments</h2>
            {payments && payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((p, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 py-2 text-sm">
                    <span className="text-gray-900">${(p.amount / 100).toFixed(2)} {p.currency?.toUpperCase()}</span>
                    <span className={p.status === 'paid' ? 'text-green-600' : 'text-gray-400'}>{p.status}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No payments yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
