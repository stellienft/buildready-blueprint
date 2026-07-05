import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const tiers = [
  {
    name: 'Blueprint Kit',
    price: '$49',
    desc: 'Everything you need to build your site.',
    features: ['Full website blueprint', 'Master AI build prompt', 'SEO structure', 'Brand direction', 'Downloadable PDF'],
    cta: 'Get Blueprint Kit',
    highlight: false,
  },
  {
    name: 'Pro Prompt Kit',
    price: '$99',
    desc: 'Builder-specific prompts for every tool.',
    features: ['Everything in Blueprint Kit', 'Bolt prompt', 'Lovable prompt', 'Framer prompt', 'Webflow prompt', 'Cursor prompt', 'Page-by-page copy'],
    cta: 'Get Pro Kit',
    highlight: true,
  },
  {
    name: 'Done-With-You Setup',
    price: '$499',
    desc: 'We build the first version for you.',
    features: ['Everything in Pro Kit', 'We generate the first version of your site', 'Handover-ready structure'],
    cta: 'Enquire',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-center font-display text-4xl font-bold text-gray-900">Pricing</h1>
        <p className="mt-4 text-center text-gray-600">Preview for free. Unlock when you&apos;re ready.</p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-8 shadow-card ${t.highlight ? 'border-brand-500 border-2' : 'border-gray-100 bg-white'}`}>
              {t.highlight && <div className="mb-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">Most popular</div>}
              <h2 className="font-display text-2xl font-bold text-gray-900">{t.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{t.desc}</p>
              <p className="mt-4 text-4xl font-bold text-gray-900">{t.price}<span className="text-base font-normal text-gray-400"> AUD</span></p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700"><Check className="mt-0.5 shrink-0 text-brand-500\" size={16} />{f}</li>
                ))}
              </ul>
              <Link href="/start" className="mt-8 block">
                <Button className="w-full" variant={t.highlight ? 'primary' : 'outline'}>{t.cta}</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
