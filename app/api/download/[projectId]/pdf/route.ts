import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { BlueprintJSON } from '@/types'

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

  await supabase.from('downloads').insert({ user_id: session.user.id, project_id: projectId, download_type: 'pdf' })

  const blueprint = bp.full_blueprint_json as unknown as BlueprintJSON
  const pdf = generateSimplePDF(blueprint, project.business_name)

  return new NextResponse(new Uint8Array(pdf), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${project.business_name}-blueprint.pdf"` },
  })
}

/**
 * Minimal PDF generator (no external deps).
 * Creates a valid PDF with the blueprint content as plain text.
 */
function generateSimplePDF(bp: BlueprintJSON, name: string): Uint8Array {
  const lines = [
    `${name} — BuildReady Blueprint`,
    '',
    'BUSINESS SUMMARY',
    bp.business_summary,
    '',
    'STRATEGIC DIRECTION',
    bp.strategic_direction,
    '',
    'BRAND DIRECTION',
    `Personality: ${bp.brand_direction.personality}`,
    `Typography: ${bp.brand_direction.typography}`,
    '',
    'HERO COPY',
    bp.copy.hero_headline,
    bp.copy.hero_subheadline,
    '',
    'MASTER PROMPT',
    bp.master_prompt.substring(0, 2000),
    '',
    'BUILDER PROMPTS',
    `Bolt: ${bp.builder_prompts.bolt.substring(0, 500)}...`,
    `Lovable: ${bp.builder_prompts.lovable.substring(0, 500)}...`,
    `Framer: ${bp.builder_prompts.framer.substring(0, 500)}...`,
    `Webflow: ${bp.builder_prompts.webflow.substring(0, 500)}...`,
    `Cursor: ${bp.builder_prompts.cursor.substring(0, 500)}...`,
  ]

  // Build minimal PDF
  const content = lines.join('\n')
  const header = '%PDF-1.4\n'
  const objects: string[] = []

  // Object 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  // Object 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')
  // Object 3: Page
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n')
  // Object 4: Content stream
  const escapedContent = content.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  const textCommands = `BT\n/F1 10 Tf\n50 750 Td\n14 TL\n(${escapedContent.split('\n').map(l => l.replace(/\n/g, '')).join(') Tj Tj (').substring(0, 5000)}) Tj\nET`
  objects.push(`4 0 obj\n<< /Length ${textCommands.length} >>\nstream\n${textCommands}\nendstream\nendobj\n`)
  // Object 5: Font
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n')

  let pdf = header
  const offsets: number[] = [0]
  for (const obj of objects) {
    offsets.push(pdf.length)
    pdf += obj
  }
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Uint8Array(Buffer.from(pdf, 'latin1'))
}
