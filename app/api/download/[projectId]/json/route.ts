import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (project.user_id !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (project.payment_status !== 'paid') return NextResponse.json({ error: 'Payment required' }, { status: 402 })

  const { data: bp } = await supabase.from('blueprints').select('full_blueprint_json').eq('project_id', projectId).order('created_at', { ascending: false }).limit(1).single()
  if (!bp) return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 })

  await supabase.from('downloads').insert({ user_id: session.user.id, project_id: projectId, download_type: 'json' })

  const json = JSON.stringify(bp.full_blueprint_json, null, 2)
  return new NextResponse(json, {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="${project.business_name}-blueprint.json"` },
  })
}
