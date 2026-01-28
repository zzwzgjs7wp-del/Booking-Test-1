import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { z } from 'zod'

export const runtime = 'nodejs'

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  duration_minutes: z.number().int().positive(),
  price_cents: z.number().int().nonnegative().nullable(),
  is_active: z.boolean().default(true)
})

const updateServiceSchema = createServiceSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', business.id)
      .order('name')

    return NextResponse.json({ data: services || [] })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createServiceSchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        ...validated,
        business_id: business.id
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: service }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const validated = updateServiceSchema.parse(updates)
    const supabase = await createClient()

    // Get service to verify business membership
    const { data: service } = await supabase
      .from('services')
      .select('business_id')
      .eq('id', id)
      .single()

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await requireBusiness({ businessId: service.business_id })

    const { data: updated, error } = await supabase
      .from('services')
      .update(validated)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get service to verify business membership
    const { data: service } = await supabase
      .from('services')
      .select('business_id')
      .eq('id', id)
      .single()

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await requireBusiness({ businessId: service.business_id })

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
