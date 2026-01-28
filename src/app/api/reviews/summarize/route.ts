import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { z } from 'zod'

export const runtime = 'nodejs'

async function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  const { default: OpenAI } = await import('openai')
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

const summarizeSchema = z.object({
  period_start: z.string().datetime(),
  period_end: z.string().datetime()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = summarizeSchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    // Check if summary already exists
    const { data: existing } = await supabase
      .from('review_summaries')
      .select('*')
      .eq('business_id', business.id)
      .eq('period_start', validated.period_start)
      .eq('period_end', validated.period_end)
      .single()

    if (existing) {
      return NextResponse.json({ data: existing })
    }

    // Get reviews in period
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', business.id)
      .gte('review_date', validated.period_start)
      .lte('review_date', validated.period_end)
      .order('review_date', { ascending: false })

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: 'No reviews found in period' }, { status: 400 })
    }

    // Analyze sentiment and generate summary
    const reviewTexts = reviews.map(r => 
      `Rating: ${r.rating}/5 - ${r.comment || 'No comment'}`
    ).join('\n')

    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst. Summarize customer reviews, highlighting key themes, sentiment trends, and actionable insights.'
        },
        {
          role: 'user',
          content: `Summarize these reviews for ${business.name}:\n\n${reviewTexts}`
        }
      ],
      temperature: 0.7
    })

    const summaryText = completion.choices[0].message.content || ''

    // Update sentiment for reviews
    for (const review of reviews) {
      if (!review.sentiment && review.comment) {
        const openaiClient = await getOpenAI()
        const sentimentCompletion = await openaiClient.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Classify the sentiment of this review as "positive", "neutral", or "negative". Respond with only one word.'
            },
            {
              role: 'user',
              content: `Rating: ${review.rating}/5 - ${review.comment}`
            }
          ],
          temperature: 0.3
        })

        const sentiment = sentimentCompletion.choices[0].message.content?.toLowerCase().trim() || 'neutral'
        
        await supabase
          .from('reviews')
          .update({ sentiment: sentiment })
          .eq('id', review.id)
      }
    }

    // Save summary
    const { data: summary, error } = await supabase
      .from('review_summaries')
      .insert({
        business_id: business.id,
        period_start: validated.period_start,
        period_end: validated.period_end,
        summary_text: summaryText
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: summary })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error summarizing reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
