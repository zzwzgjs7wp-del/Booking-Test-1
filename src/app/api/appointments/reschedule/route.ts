import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { z } from 'zod'

export const runtime = 'nodejs'

const rescheduleSchema = z.object({
  appointment_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = rescheduleSchema.parse(body)
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
      .select('business_id, status')
      .eq('id', validated.appointment_id)
      .single()

    if (!appointment || appointment.business_id !== business.id) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return NextResponse.json({ error: 'Cannot reschedule cancelled or completed appointment' }, { status: 400 })
    }

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('business_id', business.id)
      .neq('id', validated.appointment_id)
      .in('status', ['scheduled', 'confirmed'])
      .or(`and(start_time.lt.${validated.end_time},end_time.gt.${validated.start_time})`)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Time slot conflict' }, { status: 400 })
    }

    const { data: updated, error } = await supabase
      .from('appointments')
      .update({
        start_time: validated.start_time,
        end_time: validated.end_time
      })
      .eq('id', validated.appointment_id)
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
    console.error('Error rescheduling appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
