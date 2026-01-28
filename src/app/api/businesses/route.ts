import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const runtime = 'nodejs'

const createBusinessSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().default('America/New_York')
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: memberships } = await supabase
      .from('business_members')
      .select('business_id')
      .eq('user_id', user.id)

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const businessIds = memberships.map(m => m.business_id)
    const { data: businesses } = await supabase
      .from('businesses')
      .select('*')
      .in('id', businessIds)

    return NextResponse.json({ data: businesses || [] })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createBusinessSchema.parse(body)

    // Check if slug is taken
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', validated.slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 400 })
    }

    // Create business
    const { data: business, error } = await supabase
      .from('businesses')
      .insert(validated)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add user as owner
    await supabase
      .from('business_members')
      .insert({
        business_id: business.id,
        user_id: user.id,
        role: 'owner'
      })

    return NextResponse.json({ data: business }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating business:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
