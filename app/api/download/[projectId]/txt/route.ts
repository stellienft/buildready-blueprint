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

  const blueprint = bp.full_blueprint_json as unknown as BlueprintJSON
  const text = formatTxt(blueprint, project.business_name)

  // Log download
  await supabase.from('downloads').insert({ user_id: session.user.id, project_id: projectId, download_type: 'txt' })

  return new NextResponse(text, {
    headers: { 'Content-Type': 'text/plain', 'Content-Disposition': `attachment; filename="${project.business_name}-blueprint.txt"` },
  })
}

function formatTxt(bp: BlueprintJSON, name: string): string {
  const lines: string[] = []
  lines.push(`BUILDREADY BLUEPRINT — ${name}`)
  lines.push('='.repeat(50))
  lines.push('')
  lines.push('BUSINESS SUMMARY')
  lines.push(bp.business_summary)
  lines.push('')
  lines.push('STRATEGIC DIRECTION')
  lines.push(bp.strategic_direction)
  lines.push('')
  lines.push('BRAND DIRECTION')
  lines.push(`Personality: ${bp.brand_direction.personality}`)
  lines.push(`Visual Style: ${bp.brand_direction.visual_style}`)
  lines.push(`Typography: ${bp.brand_direction.typography}`)
  lines.push(`Image Direction: ${bp.brand_direction.image_direction}`)
  lines.push('Colour Palette:')
  bp.brand_direction.colour_palette?.forEach(c => lines.push(`  - ${c.name} (${c.hex}): ${c.role}`))
  lines.push('')
  lines.push('WEBSITE STRUCTURE')
  bp.website_structure.recommended_pages?.forEach(p => {
    lines.push(`  ${p.name}: ${p.purpose}`)
    p.key_sections?.forEach(s => lines.push(`    - ${s}`))
  })
  lines.push('')
  lines.push('HOMEPAGE SECTIONS')
  bp.website_structure.homepage_sections?.forEach(s => lines.push(`  ${s.name}: ${s.purpose} (${s.layout})`))
  lines.push('')
  lines.push('COPY')
  lines.push(`Hero: ${bp.copy.hero_headline}`)
  lines.push(`Sub: ${bp.copy.hero_subheadline}`)
  lines.push(`Primary CTA: ${bp.copy.primary_cta}`)
  lines.push(`Secondary CTA: ${bp.copy.secondary_cta}`)
  bp.copy.section_copy?.forEach(s => { lines.push(`  [${s.page}] ${s.heading}`); lines.push(`    ${s.body}`) })
  lines.push('')
  lines.push('SEO')
  lines.push(`Title: ${bp.seo.homepage_title}`)
  lines.push(`Meta: ${bp.seo.homepage_meta_description}`)
  lines.push(`Keywords: ${bp.seo.keywords?.join(', ')}`)
  lines.push('')
  lines.push('MASTER BUILD PROMPT')
  lines.push(bp.master_prompt)
  lines.push('')
  lines.push('BUILDER PROMPTS')
  lines.push('--- Bolt ---'); lines.push(bp.builder_prompts.bolt); lines.push('')
  lines.push('--- Lovable ---'); lines.push(bp.builder_prompts.lovable); lines.push('')
  lines.push('--- Framer ---'); lines.push(bp.builder_prompts.framer); lines.push('')
  lines.push('--- Webflow ---'); lines.push(bp.builder_prompts.webflow); lines.push('')
  lines.push('--- Cursor ---'); lines.push(bp.builder_prompts.cursor)
  return lines.join('\n')
}
