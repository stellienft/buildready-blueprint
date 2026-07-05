import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ArrowRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Project } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm text-white">B</span>
            BuildReady
          </Link>
          <form action="/api/auth/logout" method="POST">
            <Button variant="ghost" size="sm">Log out</Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">Welcome back, {session.user.email}</p>
          </div>
          <Link href="/start"><Button className="gap-2"><Plus size={16} /> New Blueprint</Button></Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: Project) => (
              <div key={p.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={p.payment_status === 'paid' ? 'success' : 'warning'}>
                    {p.payment_status === 'paid' ? 'Unlocked' : 'Preview'}
                  </Badge>
                  <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900">{p.business_name}</h3>
                <p className="text-sm text-gray-500">{p.business_type} · {p.preferred_builder}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/project/${p.id}`}>
                    <Button size="sm" variant="outline">Open</Button>
                  </Link>
                  {p.payment_status !== 'paid' && (
                    <Link href={`/unlock/${p.id}`}>
                      <Button size="sm">Unlock</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <FileText className="mx-auto text-gray-300" size={48} />
            <h3 className="mt-4 font-display text-lg font-semibold text-gray-900">No blueprints yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first AI website blueprint.</p>
            <Link href="/start" className="mt-6 inline-block">
              <Button className="gap-2"><Plus size={16} /> Start Blueprint <ArrowRight size={14} /></Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
