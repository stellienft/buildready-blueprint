import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { id: string; client_reference_id: string; metadata?: { projectId?: string; userId?: string; tier?: string }; payment_intent?: string; customer?: string; amount_total?: number }

    const projectId = session.metadata?.projectId || session.client_reference_id
    const userId = session.metadata?.userId || ''
    const tier = session.metadata?.tier || 'blueprint'

    const supabase = await createSupabaseServerClient()

    // Update payment status
    await supabase.from('payments')
      .update({ status: 'paid', stripe_payment_intent_id: session.payment_intent as string, stripe_customer_id: session.customer as string })
      .eq('stripe_checkout_session_id', session.id)

    // Update project status
    await supabase.from('projects')
      .update({ payment_status: 'paid', status: 'unlocked', updated_at: new Date().toISOString() })
      .eq('id', projectId)
  }

  return NextResponse.json({ received: true })
}
