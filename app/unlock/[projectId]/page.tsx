import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

const tiers = [
  {
    name: 'Blueprint Kit',
    price: 49,
    priceId: 'blueprint',
    features: ['Full website blueprint', 'Master AI build prompt', 'SEO structure', 'Brand direction', 'Downloadable PDF'],
    cta: 'Unlock for $49',
    highlight: false,
  },
  {
    name: 'Pro Prompt Kit',
    price: 99,
    priceId: 'pro',
    features: ['Everything in Blueprint Kit', 'Bolt prompt', 'Lovable prompt', 'Framer prompt', 'Webflow prompt', 'Cursor prompt', 'Page-by-page copy'],
    cta: 'Unlock for $99',
    highlight: true,
  },
  {
    name: 'Done-With-You Setup',
    price: 499,
    priceId: null,
    features: ['Everything in Pro Kit', 'We generate the first version of your site', 'Handover-ready structure'],
    cta: 'Enquire',
    highlight: false,
  },
]

export default async function UnlockPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 to-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-gray-900">Unlock Your Full Blueprint</h1>
          <p className="mt-4 text-gray-600">Choose your plan and get instant access.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-2xl border-2 p-8 shadow-card ${t.highlight ? 'border-brand-500' : 'border-gray-100 bg-white'}`}>
              {t.highlight && (
                <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                  <Star size={12} /> Most popular
                </div>
              )}
              <h2 className="font-display text-2xl font-bold text-gray-900">{t.name}</h2>
              <p className="mt-2 text-4xl font-bold text-gray-900">${t.price}<span className="text-base font-normal text-gray-400"> AUD</span></p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="mt-0.5 shrink-0 text-brand-500" size={16} />{f}
                  </li>
                ))}
              </ul>
              {t.priceId ? (
                <form action={`/api/stripe/create-checkout-session`} method="POST" className="mt-8">
                  <input type="hidden" name="projectId" value={projectId} />
                  <input type="hidden" name="priceId" value={t.priceId} />
                  <Button type="submit" className="w-full" variant={t.highlight ? 'primary' : 'outline'}>{t.cta}</Button>
                </form>
              ) : (
                <Link href="/contact" className="mt-8 block">
                  <Button className="w-full" variant="outline">{t.cta}</Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
