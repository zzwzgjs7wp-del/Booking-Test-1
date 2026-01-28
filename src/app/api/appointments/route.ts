import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { enqueueJob } from '@/lib/jobs'
import { z } from 'zod'

export const runtime = 'nodejs'

const createAppointmentSchema = z.object({
  customer_id: z.string().uuid(),
  service_id: z.string().uuid(),
  staff_id: z.string().uuid().optional().nullable(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  notes: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    
    let query = supabase
      .from('appointments')
      .select(`
        *,
        customer:customers(*),
        service:services(*),
        staff:staff(*)
      `)
      .eq('business_id', business.id)

    if (startDate) {
      query = query.gte('start_time', startDate)
    }
    if (endDate) {
      query = query.lte('end_time', endDate)
    }

    const { data: appointments } = await query.order('start_time')

    return NextResponse.json({ data: appointments || [] })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createAppointmentSchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    // Verify customer and service belong to business
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('id', validated.customer_id)
      .eq('business_id', business.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const { data: service } = await supabase
      .from('services')
      .select('id')
      .eq('id', validated.service_id)
      .eq('business_id', business.id)
      .single()

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('business_id', business.id)
      .in('status', ['scheduled', 'confirmed'])
      .or(`and(start_time.lt.${validated.end_time},end_time.gt.${validated.start_time})`)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Time slot conflict' }, { status: 400 })
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        ...validated,
        business_id: business.id,
        status: 'scheduled'
      })
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

    // Schedule reminder notifications (24 hours before appointment)
    try {
      const appointmentStart = new Date(validated.start_time)
      const reminderTime = new Date(appointmentStart.getTime() - 24 * 60 * 60 * 1000) // 24h before
      
      // Only schedule if reminder time is in the future
      if (reminderTime > new Date()) {
        const customerData = appointment.customer as { email?: string; phone?: string; name?: string }
        const serviceData = appointment.service as { name?: string }
        const staffData = appointment.staff as { name?: string } | null
        
        const appointmentTime = appointmentStart.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        
        const reminderMessage = `Reminder: Your ${serviceData.name || 'appointment'} is tomorrow at ${appointmentTime}${staffData ? ` with ${staffData.name}` : ''}.`

        // Schedule SMS reminder if phone available
        if (customerData.phone) {
          await enqueueJob({
            businessId: business.id,
            type: 'reminders.send',
            runAt: reminderTime,
            payload: {
              channel: 'sms',
              to: customerData.phone,
              message: reminderMessage,
            },
          })
        }

        // Schedule email reminder if email available
        if (customerData.email) {
          await enqueueJob({
            businessId: business.id,
            type: 'reminders.send',
            runAt: reminderTime,
            payload: {
              channel: 'email',
              to: customerData.email,
              subject: `Appointment Reminder - ${serviceData.name || 'Your Appointment'}`,
              message: reminderMessage,
              html: `<p>Hi ${customerData.name || 'there'},</p><p>${reminderMessage}</p><p>We look forward to seeing you!</p>`,
            },
          })
        }
      }
    } catch (reminderError) {
      // Log error but don't fail appointment creation
      console.error('Failed to schedule reminders:', reminderError)
    }

    return NextResponse.json({ data: appointment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
