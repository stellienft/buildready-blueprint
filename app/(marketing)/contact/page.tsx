'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    // Placeholder - would send to API
    console.log(data)
    alert('Message sent! We\'ll get back to you soon.')
  }

  return (
    <div className="py-20">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="text-center font-display text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-center text-gray-600">Questions? Feedback? We&apos;d love to hear from you.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          <Input label="Name" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Textarea label="Message" rows={5} {...register('message')} error={errors.message?.message} />
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Sending...' : 'Send Message'}</Button>
        </form>
      </div>
    </div>
  )
}
