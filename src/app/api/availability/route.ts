import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { calculateAvailability } from '@/lib/availability'
import { z } from 'zod'

export const runtime = 'nodejs'

const availabilitySchema = z.object({
  serviceId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  staffId: z.string().uuid().optional().nullable()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = availabilitySchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    const slots = await calculateAvailability(supabase, {
      businessId: business.id,
      serviceId: validated.serviceId,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      staffId: validated.staffId || undefined
    })

    return NextResponse.json({ 
      data: slots.map(slot => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        staffId: slot.staffId
      }))
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error calculating availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
