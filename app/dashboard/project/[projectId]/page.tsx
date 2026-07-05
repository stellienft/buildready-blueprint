import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Lock, Copy, Download, FileText, Palette, Code2, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { BlueprintJSON } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single()
  if (!project) notFound()

  const isPaid = project.payment_status === 'paid'

  const { data: bp } = await supabase.from('blueprints').select('*').eq('project_id', projectId).order('created_at', { ascending: false }).limit(1).single()
  const blueprint = bp?.full_blueprint_json as unknown as BlueprintJSON | null

  if (!isPaid) {
    redirect(`/preview/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm text-white">B</span>
            Dashboard
          </Link>
          <Badge variant="success">Unlocked</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-gray-900">{project.business_name}</h1>
        <p className="mt-1 text-gray-500">Full blueprint</p>

        {blueprint && (
          <div className="mt-8 space-y-6">
            {/* Downloads */}
            <div className="flex flex-wrap gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="w-full font-display text-lg font-semibold text-gray-900">Download Blueprint</h2>
              <a href={`/api/download/${projectId}/txt`}><Button variant="outline" size="sm" className="gap-2"><Download size={14} /> TXT</Button></a>
              <a href={`/api/download/${projectId}/json`}><Button variant="outline" size="sm" className="gap-2"><Download size={14} /> JSON</Button></a>
              <a href={`/api/download/${projectId}/pdf`}><Button variant="outline" size="sm" className="gap-2"><Download size={14} /> PDF</Button></a>
            </div>

            {/* Business Summary */}
            <Section icon={FileText} title="Business Summary">
              <p className="text-sm text-gray-700">{blueprint.business_summary}</p>
            </Section>

            {/* Strategic Direction */}
            <Section icon={FileText} title="Strategic Direction">
              <p className="text-sm text-gray-700">{blueprint.strategic_direction}</p>
            </Section>

            {/* Brand Direction */}
            <Section icon={Palette} title="Brand Direction">
              <p className="mb-3 text-sm text-gray-700">{blueprint.brand_direction.personality}</p>
              <p className="mb-3 text-sm text-gray-700">{blueprint.brand_direction.visual_style}</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {blueprint.brand_direction.colour_palette?.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
                    <div className="h-8 w-8 rounded" style={{ background: c.hex }} />
                    <div><div className="text-xs font-medium text-gray-900">{c.name}</div><div className="text-xs text-gray-500">{c.hex} · {c.role}</div></div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-700"><strong>Typography:</strong> {blueprint.brand_direction.typography}</p>
              <p className="mt-2 text-sm text-gray-700"><strong>Image direction:</strong> {blueprint.brand_direction.image_direction}</p>
            </Section>

            {/* Website Structure */}
            <Section icon={Code2} title="Website Structure">
              <div className="space-y-3">
                {blueprint.website_structure.recommended_pages?.map((p, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-900">{p.name}</h4>
                    <p className="text-sm text-gray-600">{p.purpose}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.key_sections?.map((s, j) => (
                        <span key={j} className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Copy */}
            <Section icon={FileText} title="Website Copy">
              <div className="mb-4 rounded-lg bg-brand-50 p-4">
                <h4 className="font-display text-xl font-bold text-gray-900">{blueprint.copy.hero_headline}</h4>
                <p className="mt-1 text-sm text-gray-600">{blueprint.copy.hero_subheadline}</p>
                <div className="mt-3 flex gap-3">
                  <span className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">{blueprint.copy.primary_cta}</span>
                  <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">{blueprint.copy.secondary_cta}</span>
                </div>
              </div>
              {blueprint.copy.section_copy?.map((s, i) => (
                <div key={i} className="mb-3 rounded-lg bg-gray-50 p-4">
                  <span className="text-xs font-medium text-brand-600">{s.page}</span>
                  <h4 className="mt-1 font-medium text-gray-900">{s.heading}</h4>
                  <p className="mt-1 text-sm text-gray-600">{s.body}</p>
                </div>
              ))}
            </Section>

            {/* SEO */}
            <Section icon={Search} title="SEO">
              <p className="text-sm text-gray-700"><strong>Title:</strong> {blueprint.seo.homepage_title}</p>
              <p className="mt-1 text-sm text-gray-700"><strong>Meta:</strong> {blueprint.seo.homepage_meta_description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {blueprint.seo.keywords?.map((k, i) => (
                  <span key={i} className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">{k}</span>
                ))}
              </div>
            </Section>

            {/* Master Prompt */}
            <PromptSection title="Master AI Build Prompt" content={blueprint.master_prompt} />

            {/* Builder Prompts */}
            <PromptSection title="Bolt Prompt" content={blueprint.builder_prompts.bolt} />
            <PromptSection title="Lovable Prompt" content={blueprint.builder_prompts.lovable} />
            <PromptSection title="Framer Prompt" content={blueprint.builder_prompts.framer} />
            <PromptSection title="Webflow Prompt" content={blueprint.builder_prompts.webflow} />
            <PromptSection title="Cursor Prompt" content={blueprint.builder_prompts.cursor} />
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
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

function PromptSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-gray-900">{title}</h2>
        <CopyButton text={content} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{content}</pre>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text) }}
      className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
    >
      <Copy size={12} /> Copy
    </button>
  )
}
