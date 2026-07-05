'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'What is a website blueprint?', a: 'A complete plan for your website including structure, copy, brand direction, SEO, and ready-to-use AI build prompts that you can paste into tools like Bolt, Lovable, or Cursor.' },
  { q: 'How long does generation take?', a: 'About 30-60 seconds. You answer a short questionnaire, and the AI generates your full blueprint automatically.' },
  { q: 'Can I see a preview before paying?', a: 'Yes. You get a free preview including your business summary, brand direction, and sample homepage sections. The full blueprint and build prompts are unlocked after payment.' },
  { q: 'Which AI builders are supported?', a: 'We generate specific prompts for Bolt, Lovable, Framer, Webflow, and Cursor. Each prompt is tailored to the builder\'s strengths.' },
  { q: 'Can I download my blueprint?', a: 'Yes. Once unlocked, you can download your blueprint as PDF, TXT, or JSON.' },
  { q: 'Is my data secure?', a: 'Your data is stored securely with row-level security. Only you can access your projects and blueprints.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-center font-display text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow-soft">
              <button className="flex w-full items-center justify-between p-6 text-left" onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-medium text-gray-900">{f.q}</span>
                <ChevronDown className={`shrink-0 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              {open === i && <div className="px-6 pb-6 text-sm text-gray-600">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
