import { FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const examples = [
  { business: 'Coastal Fitness Coaching', type: 'Coach', desc: 'Complete blueprint with hero copy, service pages, and booking flow.', color: 'from-blue-50 to-blue-100' },
  { business: 'Bella Cafe & Restaurant', type: 'Restaurant', desc: 'Menu showcase, reservation system, and event booking blueprint.', color: 'from-orange-50 to-orange-100' },
  { business: 'Dr. Sarah Wellness Clinic', type: 'Health', desc: 'Practitioner profiles, treatment pages, and patient intake flow.', color: 'from-green-50 to-green-100' },
]

export default function ExamplesPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-center font-display text-4xl font-bold text-gray-900">Example Blueprints</h1>
        <p className="mt-4 text-center text-gray-600">See what your AI-generated blueprint looks like.</p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {examples.map((e) => (
            <div key={e.business} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
              <div className={`h-40 bg-gradient-to-br ${e.color} flex items-center justify-center`}>
                <FileText className="text-gray-400\" size={48} />
              </div>
              <div className="p-6">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{e.type}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-gray-900">{e.business}</h3>
                <p className="mt-2 text-sm text-gray-600">{e.desc}</p>
                <Link href="/start" className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600">View blueprint <ArrowRight size={14} /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
