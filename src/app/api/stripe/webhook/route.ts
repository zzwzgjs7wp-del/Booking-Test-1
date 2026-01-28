import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia'
  })
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing Stripe signature/secret' }, { status: 400 })
  }

  const body = await req.text() // IMPORTANT: raw body

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verify failed: ${err.message}` }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // You should set metadata.business_id when creating checkout sessions
        const businessId = session.metadata?.business_id
        const subId = session.subscription?.toString()
        const customerId = session.customer?.toString()

        if (businessId && subId && session.mode === 'subscription') {
          // Fetch full subscription details
          const subscription = await stripe.subscriptions.retrieve(subId)

          await supabase
            .from('subscriptions')
            .upsert(
              {
                business_id: businessId,
                stripe_customer_id: customerId || subscription.customer.toString(),
                stripe_subscription_id: subId,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end !== null,
              },
              {
                onConflict: 'stripe_subscription_id',
              }
            )
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const businessId = sub.metadata?.business_id

        if (businessId) {
          await supabase
            .from('subscriptions')
            .upsert(
              {
                business_id: businessId,
                stripe_subscription_id: sub.id,
                stripe_customer_id: sub.customer.toString(),
                status: sub.status,
                current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                cancel_at_period_end: sub.cancel_at_period_end !== null,
              },
              {
                onConflict: 'stripe_subscription_id',
              }
            )
        } else {
          // Fallback: try to find business by subscription ID
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('business_id')
            .eq('stripe_subscription_id', sub.id)
            .single()

          if (existing) {
            await supabase
              .from('subscriptions')
              .update({
                stripe_customer_id: sub.customer.toString(),
                status: sub.status,
                current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
                cancel_at_period_end: sub.cancel_at_period_end !== null,
              })
              .eq('stripe_subscription_id', sub.id)
          }
        }
        break
      }

      default:
        // Log unhandled events for debugging
        console.log(`Unhandled Stripe webhook event type: ${event.type}`)
        break
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: `Webhook handler failed: ${err.message}` }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
