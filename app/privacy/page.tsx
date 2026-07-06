import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Privacy Policy — BuildReady Blueprint',
  description: 'How BuildReady Blueprint handles your data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="font-display text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="font-display text-lg font-semibold text-gray-900">Data we collect</h2>
          <p className="mt-2">We collect your email address when you create an account, and the questionnaire answers you provide when generating a blueprint. Payment details are processed by Stripe and never stored on our servers.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-gray-900">How we use your data</h2>
          <p className="mt-2">Your data is used to generate AI blueprints, save your projects, and provide you with access to purchased downloads. We use OpenAI to process blueprint generation requests.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-gray-900">Data retention</h2>
          <p className="mt-2">Your project data and blueprints are retained for as long as your account is active. You can request deletion at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2">Questions about privacy? Email hello@stellio.com.au</p>
        </section>
      </div>

      <div className="mt-12">
        <Link href="/"><Button variant="ghost">Back to home</Button></Link>
      </div>
    </div>
  )
}
