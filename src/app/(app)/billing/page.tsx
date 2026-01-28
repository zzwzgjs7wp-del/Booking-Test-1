import { Suspense } from 'react'
import BillingPageClient from './billing-client'

export const dynamic = 'force-dynamic'

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <BillingPageClient />
    </Suspense>
  )
}
