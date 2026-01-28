import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { z } from 'zod'

export const runtime = 'nodejs'

const cancelSchema = z.object({
  appointment_id: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = cancelSchema.parse(body)
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
      return NextResponse.json({ error: 'Appointment already cancelled or completed' }, { status: 400 })
    }

    const { data: updated, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
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
    console.error('Error cancelling appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
