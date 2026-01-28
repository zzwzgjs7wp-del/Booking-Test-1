import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { z } from 'zod'

export const runtime = 'nodejs'

const ingestReviewSchema = z.object({
  source: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  reviewer_name: z.string().optional(),
  review_date: z.string().datetime().optional(),
  customer_id: z.string().uuid().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = ingestReviewSchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        ...validated,
        business_id: business.id,
        review_date: validated.review_date || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: review }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error ingesting review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
