'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'

const steps = [
  'Analysing your business',
  'Mapping your website structure',
  'Creating your brand direction',
  'Writing your website copy',
  'Preparing your AI build prompt',
]

export default function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1
        clearInterval(interval)
        return prev
      })
    }, 800)

    const timeout = setTimeout(async () => {
      const data = localStorage.getItem('questionnaire_data')
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, data: data ? JSON.parse(data) : null }),
        })
        const result = await response.json()
        if (result.projectId) {
          router.push(`/preview/${result.projectId}`)
        } else {
          router.push('/preview/guest')
        }
      } catch {
        router.push('/preview/guest')
      }
    }, 4500)

    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [router, projectId])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50/50 to-white px-4">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-float">
        <Sparkles className="animate-pulse text-white" size={36} />
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Generating your blueprint</h1>
      <p className="mt-2 text-sm text-gray-500">This will only take a moment...</p>
      <div className="mt-8 w-full max-w-sm space-y-3">
        {steps.map((step, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-xl p-3 transition ${i <= currentStep ? 'bg-white shadow-soft' : 'opacity-30'}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i < currentStep ? 'bg-green-100 text-green-600' : i === currentStep ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${i <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
