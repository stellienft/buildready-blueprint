import { NextResponse } from 'next/server'
import { stripe, PRICE_MAP } from '@/lib/stripe/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const projectId = formData.get('projectId') as string
    const priceIdKey = formData.get('priceId') as string

    const priceInfo = PRICE_MAP[priceIdKey]
    if (!priceInfo) return NextResponse.json({ error: 'Invalid price' }, { status: 400 })

    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceInfo.id, quantity: 1 }],
      success_url: `${siteUrl}/dashboard/project/${projectId}?status=success`,
      cancel_url: `${siteUrl}/unlock/${projectId}?status=cancelled`,
      client_reference_id: projectId,
      customer_email: session.user.email,
      metadata: { projectId, userId: session.user.id, tier: priceIdKey },
    })

    // Save payment record as pending
    await supabase.from('payments').insert({
      user_id: session.user.id,
      project_id: projectId,
      stripe_checkout_session_id: checkoutSession.id,
      amount: priceInfo.amount,
      currency: 'aud',
      status: 'pending',
    })

    return NextResponse.redirect(checkoutSession.url!, 303)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
