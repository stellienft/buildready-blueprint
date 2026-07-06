'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'

const businessTypes = ['Coach / consultant', 'Tradie', 'Restaurant / cafe', 'Ecommerce', 'Beauty / wellness', 'Health practitioner', 'Real estate', 'Professional services', 'Creative business', 'SaaS / technology', 'Other']
const websiteGoals = ['Generate leads', 'Book calls', 'Sell services', 'Sell products', 'Build authority', 'Capture email subscribers', 'Launch a new brand']
const brandStyles = ['Minimal', 'Premium', 'Bold', 'Soft', 'Earthy', 'Playful', 'Luxury', 'Editorial', 'Tech', 'Corporate']
const tones = ['Professional', 'Warm', 'Direct', 'Elegant', 'Friendly', 'Spiritual', 'Bold', 'Playful', 'Premium']
const builders = ['Bolt', 'Lovable', 'Framer', 'Webflow', 'Cursor', 'Other']
const allPages = ['Home', 'About', 'Services', 'Pricing', 'Contact', 'Blog', 'Portfolio', 'Testimonials', 'FAQ', 'Book', 'Shop', 'Team']

const schema = z.object({
  business_name: z.string().min(2, 'Required'),
  business_type: z.string().min(1, 'Select one'),
  main_offer: z.string().min(5, 'Tell us about your offer'),
  target_audience: z.string().min(5, 'Who are your customers?'),
  website_goal: z.string().min(1, 'Select one'),
  brand_style: z.string().min(1, 'Select one'),
  tone_of_voice: z.string().min(1, 'Select one'),
  colour_preferences: z.string().optional(),
  existing_branding: z.string().optional(),
  pages_needed: z.array(z.string()).optional(),
  preferred_builder: z.string().min(1, 'Select one'),
})

type FormData = z.infer<typeof schema>

const steps = [
  { key: 'business_name', label: 'Business name', type: 'text', placeholder: 'e.g. Coastal Fitness' },
  { key: 'business_type', label: 'Business type', type: 'cards', options: businessTypes },
  { key: 'main_offer', label: 'Main offer', type: 'textarea', placeholder: 'What do you sell or provide?' },
  { key: 'target_audience', label: 'Target audience', type: 'textarea', placeholder: 'Who are your ideal customers?' },
  { key: 'website_goal', label: 'Website goal', type: 'cards', options: websiteGoals },
  { key: 'brand_style', label: 'Brand style', type: 'pills', options: brandStyles },
  { key: 'tone_of_voice', label: 'Tone of voice', type: 'pills', options: tones },
  { key: 'colour_preferences', label: 'Colour preferences', type: 'text', placeholder: 'e.g. Blue & green, warm tones (optional)' },
  { key: 'existing_branding', label: 'Existing branding', type: 'textarea', placeholder: 'Logo, colours, fonts you already have (optional)' },
  { key: 'pages_needed', label: 'Pages needed', type: 'checkboxes', options: allPages },
  { key: 'preferred_builder', label: 'Preferred AI builder', type: 'cards', options: builders },
] as const

export default function StartPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onSubmit' })

  const currentStep = steps[step]
  const isReview = step === steps.length
  const currentValue = currentStep ? watch(currentStep.key as keyof FormData) : undefined

  const handleNext = () => {
    if (step < steps.length) {
      if (currentStep.key === 'pages_needed') {
        setValue('pages_needed', selectedPages)
      }
      setStep(step + 1)
    }
  }
  const handleBack = () => { if (step > 0) setStep(step - 1) }

  const togglePage = (page: string) => {
    setSelectedPages((prev) => prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page])
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    data.pages_needed = selectedPages

    // Save to localStorage for non-authed users
    localStorage.setItem('questionnaire_data', JSON.stringify(data))

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const { data: project } = await supabase.from('projects').insert({
        user_id: session.user.id,
        business_name: data.business_name,
        business_type: data.business_type,
        main_offer: data.main_offer,
        target_audience: data.target_audience,
        website_goal: data.website_goal,
        brand_style: data.brand_style,
        tone_of_voice: data.tone_of_voice,
        colour_preferences: data.colour_preferences || '',
        existing_branding: data.existing_branding || '',
        pages_needed: selectedPages,
        preferred_builder: data.preferred_builder,
        status: 'preview',
        payment_status: 'unpaid',
      }).select().single()

      if (project) {
        router.push(`/generating?projectId=${project.id}`)
        return
      }
    }

    router.push('/generating')
  }

  const selectValue = (key: string, value: string) => {
    setValue(key as keyof FormData, value as never)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 to-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
            <span>{isReview ? 'Review' : `Step ${step + 1} of ${steps.length + 1}`}</span>
            <span>{Math.round(((step + 1) / (steps.length + 1)) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-300" style={{ width: `${((step + 1) / (steps.length + 1)) * 100}%` }} />
          </div>
        </div>

        {!isReview ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-gray-900">{currentStep.label}</h2>

            <div className="mt-6">
              {currentStep.type === 'text' && (
                <Input placeholder={currentStep.placeholder} {...register(currentStep.key as keyof FormData)} error={errors[currentStep.key as keyof FormData]?.message} />
              )}
              {currentStep.type === 'textarea' && (
                <Textarea rows={4} placeholder={currentStep.placeholder} {...register(currentStep.key as keyof FormData)} error={errors[currentStep.key as keyof FormData]?.message} />
              )}
              {currentStep.type === 'cards' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {currentStep.options.map((opt) => (
                    <button key={opt} type="button" onClick={() => selectValue(currentStep.key, opt)}
                      className={`rounded-xl border p-4 text-left transition ${currentValue === opt ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="text-sm font-medium text-gray-900">{opt}</span>
                    </button>
                  ))}
                </div>
              )}
              {currentStep.type === 'pills' && (
                <div className="flex flex-wrap gap-2">
                  {currentStep.options.map((opt) => (
                    <button key={opt} type="button" onClick={() => selectValue(currentStep.key, opt)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${currentValue === opt ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {currentStep.type === 'checkboxes' && (
                <div className="flex flex-wrap gap-2">
                  {currentStep.options.map((opt) => (
                    <button key={opt} type="button" onClick={() => togglePage(opt)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedPages.includes(opt) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {selectedPages.includes(opt) && <Check size={14} className="mr-1 inline" />}{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handleBack} disabled={step === 0}><ArrowLeft size={16} className="mr-1" /> Back</Button>
              <Button onClick={handleNext}>Next <ArrowRight size={16} className="ml-1" /></Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-gray-900">Review your answers</h2>
            <div className="mt-6 space-y-2">
              {steps.map((s) => {
                const val = s.key === 'pages_needed' ? selectedPages.join(', ') : watch(s.key as keyof FormData)
                return (
                  <div key={s.key} className="flex justify-between border-b border-gray-50 py-2 text-sm">
                    <span className="text-gray-500">{s.label}</span>
                    <span className="font-medium text-gray-900">{val || '—'}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handleBack}><ArrowLeft size={16} className="mr-1" /> Back</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Generating...' : 'Generate Blueprint'}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
