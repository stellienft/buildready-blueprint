import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
})

export const BLUEPRINT_PRICE_ID = process.env.STRIPE_BLUEPRINT_PRICE_ID || 'price_blueprint'
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_pro'

export const PRICE_MAP: Record<string, { id: string; amount: number }> = {
  blueprint: { id: BLUEPRINT_PRICE_ID, amount: 4900 },
  pro: { id: PRO_PRICE_ID, amount: 9900 },
}
