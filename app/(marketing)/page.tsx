import Link from 'next/link'
import { ArrowRight, Sparkles, FileText, Palette, Code2, Download, Zap, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 to-white py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles size={16} /> AI-powered website blueprints
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Build a website blueprint in minutes.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Answer a few guided questions and generate a complete AI-ready website plan, brand direction, copy structure and build prompt.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/start"><Button size="lg" className="gap-2">Start My Blueprint <ArrowRight size={18} /></Button></Link>
            <Link href="/examples"><Button variant="outline" size="lg">See Example</Button></Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-gray-900">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: FileText, step: '1', title: 'Answer questions', desc: 'Tell us about your business, brand, audience and goals in a guided form.' },
              { icon: Sparkles, step: '2', title: 'AI generates blueprint', desc: 'Get a complete website plan, brand direction, copy and build prompts.' },
              { icon: Download, step: '3', title: 'Download & build', desc: 'Preview for free. Unlock the full blueprint and copy prompts into your builder.' },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon size={24} />
                </div>
                <div className="mb-1 text-sm font-semibold text-brand-600">Step {s.step}</div>
                <h3 className="mb-2 font-display text-xl font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-gray-900">What you get</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: 'Business summary', desc: 'AI-crafted overview of your business positioning.' },
              { icon: Palette, title: 'Brand direction', desc: 'Colour palette, typography and visual style guide.' },
              { icon: Code2, title: 'Website structure', desc: 'Page-by-page plan with recommended sections.' },
              { icon: FileText, title: 'Copy & SEO', desc: 'Hero headlines, CTAs, meta titles and keywords.' },
              { icon: Zap, title: 'AI build prompts', desc: 'Ready-to-paste prompts for Bolt, Lovable, Framer, Webflow & Cursor.' },
              { icon: Download, title: 'Downloads', desc: 'Export as PDF, TXT or JSON for easy sharing.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <Check className="mb-2 text-brand-500" size={20} />
                <h3 className="font-display text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-gray-900">Who it&apos;s for</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {['Coaches', 'Tradies', 'Restaurants', 'Ecommerce', 'Health', 'Beauty', 'Real Estate', 'Agencies', 'SaaS', 'Creatives'].map((t) => (
              <div key={t} className="rounded-xl border border-gray-100 bg-white px-4 py-6 text-center shadow-soft">
                <span className="text-sm font-medium text-gray-700">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900">Simple pricing</h2>
          <p className="mt-4 text-gray-600">Start free. Unlock when you&apos;re ready.</p>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:justify-center">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-left shadow-card">
              <h3 className="font-display text-xl font-semibold text-gray-900">Blueprint Kit</h3>
              <p className="mt-1 text-3xl font-bold text-brand-600">$49</p>
              <p className="mt-2 text-sm text-gray-600">Full blueprint + master prompt + SEO</p>
            </div>
            <div className="rounded-2xl border-2 border-brand-500 bg-white p-8 text-left shadow-card">
              <div className="mb-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">Popular</div>
              <h3 className="font-display text-xl font-semibold text-gray-900">Pro Prompt Kit</h3>
              <p className="mt-1 text-3xl font-bold text-brand-600">$99</p>
              <p className="mt-2 text-sm text-gray-600">Everything + all builder prompts + page copy</p>
            </div>
          </div>
          <div className="mt-8"><Link href="/pricing"><Button variant="outline">See full pricing</Button></Link></div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-8 py-16 text-center shadow-float">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Ready to build your blueprint?</h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">Generate your AI website blueprint in under 5 minutes.</p>
            <div className="mt-8"><Link href="/start"><Button variant="secondary" size="lg" className="gap-2">Start Now <ArrowRight size={18} /></Button></Link></div>
          </div>
        </div>
      </section>
    </>
  )
}
