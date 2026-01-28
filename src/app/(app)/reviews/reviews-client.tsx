'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Review {
  id: string
  source: string
  rating: number
  comment: string | null
  reviewer_name: string | null
  review_date: string | null
  sentiment: string | null
}

export default function ReviewsPageClient() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!businessId) return

    fetch(`/api/reviews?businessId=${businessId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching reviews:', err)
        setLoading(false)
      })
  }, [businessId])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <Button>Generate Summary</Button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.reviewer_name || 'Anonymous'}</span>
                  <span className="text-sm text-muted-foreground">({review.source})</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              {review.sentiment && (
                <span className={`px-2 py-1 rounded text-xs ${
                  review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {review.sentiment}
                </span>
              )}
            </div>
            {review.comment && (
              <p className="text-muted-foreground mt-2">{review.comment}</p>
            )}
            {review.review_date && (
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(review.review_date).toLocaleDateString()}
              </p>
            )}
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      )}
    </div>
  )
}
