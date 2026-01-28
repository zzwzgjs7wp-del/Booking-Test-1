import { Suspense } from 'react'
import ReviewsPageClient from './reviews-client'

export const dynamic = 'force-dynamic'

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ReviewsPageClient />
    </Suspense>
  )
}
