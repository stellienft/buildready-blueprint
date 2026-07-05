import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Lock, Sparkles, Palette, FileText, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { BlueprintJSON } from '@/types'

export const dynamic = 'force-dynamic'

export default async function PreviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  let blueprint: BlueprintJSON | null = null
  let isPaid = false
  let businessName = 'Your Business'

  try {
    const supabase = await createSupabaseServerClient()
    const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()
    if (project) {
      businessName = project.business_name
      isPaid = project.payment_status === 'paid'
      const { data: bp } = await supabase.from('blueprints').select('*').eq('project_id', projectId).order('created_at', { ascending: false }).limit(1).single()
      if (bp) blueprint = bp.full_blueprint_json as unknown as BlueprintJSON
    }
  } catch { notFound() }

  // Guest preview from localStorage (passed via search params or mock)
  if (!blueprint) {
    blueprint = getMockBlueprint(businessName)
  }

  const preview = blueprint

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 to-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">{businessName} Blueprint</h1>
            <p className="mt-1 text-gray-500">Your AI-generated website blueprint</p>
          </div>
          <Badge variant={isPaid ? 'success' : 'warning'}>{isPaid ? 'Unlocked' : 'Preview'}</Badge>
        </div>

        {/* Free preview sections */}
        <div className="space-y-6">
          <PreviewCard icon={FileText} title="Business Summary">
            <p className="text-sm text-gray-700">{preview.business_summary}</p>
          </PreviewCard>

          <PreviewCard icon={Sparkles} title="Strategic Direction">
            <p className="text-sm text-gray-700">{preview.strategic_direction}</p>
          </PreviewCard>

          <PreviewCard icon={Palette} title="Brand Direction">
            <p className="mb-3 text-sm text-gray-700">{preview.brand_direction.personality}</p>
            <div className="flex flex-wrap gap-2">
              {preview.brand_direction.colour_palette?.map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
                  <div className="h-6 w-6 rounded" style={{ background: c.hex }} />
                  <span className="text-xs font-medium text-gray-600">{c.name}</span>
                </div>
              ))}
            </div>
          </PreviewCard>

          <PreviewCard icon={FileText} title="Hero Copy">
            <h3 className="font-display text-xl font-bold text-gray-900">{preview.copy.hero_headline}</h3>
            <p className="mt-1 text-sm text-gray-600">{preview.copy.hero_subheadline}</p>
          </PreviewCard>

          <PreviewCard icon={FileText} title="Sample Homepage Sections">
            <div className="space-y-2">
              {preview.website_structure.homepage_sections?.slice(0, 3).map((s, i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-900">{s.name}</span>
                  <p className="text-xs text-gray-500">{s.purpose}</p>
                </div>
              ))}
            </div>
          </PreviewCard>

          {/* Locked sections */}
          {!isPaid && (
            <>
              <div className="space-y-3">
                {['Full Website Blueprint', 'Master AI Build Prompt', 'Bolt Prompt', 'Lovable Prompt', 'Framer Prompt', 'Webflow Prompt', 'Cursor Prompt', 'SEO Structure', 'Page-by-Page Copy', 'Download Files'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"><Lock size={14} className="text-gray-400" /></div>
                    <span className="flex-1 text-sm font-medium text-gray-400">{item}</span>
                    <span className="text-xs text-gray-400">Locked</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-center shadow-float">
                <h2 className="font-display text-2xl font-bold text-white">Unlock Full Blueprint</h2>
                <p className="mt-2 text-brand-100">Get the complete blueprint, all AI build prompts, SEO, and downloads.</p>
                <Link href={`/unlock/${projectId}`} className="mt-6 inline-block">
                  <Button variant="secondary" size="lg">Unlock Now</Button>
                </Link>
              </div>
            </>
          )}

          {/* Unlocked sections */}
          {isPaid && (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-green-800"><Check size={20} /> Full Blueprint Unlocked</h2>
              <p className="mt-1 text-sm text-green-600">Access your complete blueprint in the dashboard.</p>
              <Link href={`/dashboard/project/${projectId}`} className="mt-4 inline-block">
                <Button>View Full Blueprint</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-brand-600" />
        <h2 className="font-display text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function getMockBlueprint(name: string): BlueprintJSON {
  return {
    business_summary: `${name} is a business built for growth. This preview shows your AI-generated summary.`,
    strategic_direction: `Position ${name} as the go-to specialist. Lead with outcomes, convert with trust.`,
    brand_direction: {
      personality: 'Confident, expert yet human.',
      visual_style: 'Clean, modern, generous whitespace.',
      colour_palette: [{ name: 'Primary', hex: '#6d28d9', role: 'Brand' }, { name: 'Accent', hex: '#f59e0b', role: 'CTA' }],
      typography: 'Sora + Inter',
      image_direction: 'Authentic photography.',
    },
    website_structure: {
      recommended_pages: [],
      homepage_sections: [
        { name: 'Hero', purpose: 'Drive primary CTA', layout: 'Full-width' },
        { name: 'Features', purpose: 'Show value', layout: '3 cards' },
        { name: 'CTA', purpose: 'Convert', layout: 'Full-width band' },
      ],
    },
    copy: {
      hero_headline: `${name}: Built different`,
      hero_subheadline: 'The smart way to grow.',
      primary_cta: 'Get started',
      secondary_cta: 'Learn more',
      section_copy: [],
    },
    seo: { homepage_title: `${name}`, homepage_meta_description: '', keywords: [] },
    master_prompt: '',
    builder_prompts: { bolt: '', lovable: '', framer: '', webflow: '', cursor: '' },
  }
}
