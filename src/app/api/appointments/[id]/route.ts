import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { z } from 'zod'

export const runtime = 'nodejs'

const updateAppointmentSchema = z.object({
  customer_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional().nullable(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
  notes: z.string().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validated = updateAppointmentSchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    // Verify appointment belongs to business
    const { data: appointment } = await supabase
      .from('appointments')
      .select('business_id')
      .eq('id', params.id)
      .single()

    if (!appointment || appointment.business_id !== business.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Check for conflicts if time is changing
    if (validated.start_time || validated.end_time) {
      const startTime = validated.start_time || appointment.start_time
      const endTime = validated.end_time || appointment.end_time

      const { data: conflicts } = await supabase
        .from('appointments')
        .select('id')
        .eq('business_id', business.id)
        .neq('id', params.id)
        .in('status', ['scheduled', 'confirmed'])
        .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

      if (conflicts && conflicts.length > 0) {
        return NextResponse.json({ error: 'Time slot conflict' }, { status: 400 })
      }
    }

    const { data: updated, error } = await supabase
      .from('appointments')
      .update(validated)
      .eq('id', params.id)
      .select(`
        *,
        customer:customers(*),
        service:services(*),
        staff:staff(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    // Verify appointment belongs to business
    const { data: appointment } = await supabase
      .from('appointments')
      .select('business_id')
      .eq('id', params.id)
      .single()

    if (!appointment || appointment.business_id !== business.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
