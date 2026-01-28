'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId')
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!businessId) return

    fetch(`/api/subscriptions?businessId=${businessId}`)
      .then(res => res.json())
      .then(data => {
        setSubscription(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching subscription:', err)
        setLoading(false)
      })
  }, [businessId])

  const handleCheckout = async () => {
    if (!businessId) return

    try {
      const res = await fetch(`/api/stripe/checkout?businessId=${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
    }
  }

  const handlePortal = async () => {
    if (!businessId) return

    try {
      const res = await fetch(`/api/stripe/portal?businessId=${businessId}`, {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing</h1>

      <Card className="p-6">
        {subscription ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
            <div className="space-y-2 mb-4">
              <p><strong>Status:</strong> {subscription.status}</p>
              {subscription.current_period_end && (
                <p>
                  <strong>Renews:</strong>{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            <Button onClick={handlePortal}>Manage Subscription</Button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">No Active Subscription</h2>
            <p className="text-muted-foreground mb-4">
              Subscribe to unlock all features of LocalPulse.
            </p>
            <Button onClick={handleCheckout}>Subscribe Now</Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <BillingPageContent />
    </Suspense>
  )
}
