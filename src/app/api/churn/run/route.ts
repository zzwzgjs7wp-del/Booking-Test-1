import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'

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

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createServiceRoleClient()

    const snapshotDate = new Date().toISOString().split('T')[0]

    // Get all customers
    const { data: customers } = await supabase
      .from('customers')
      .select('id')
      .eq('business_id', business.id)

    if (!customers || customers.length === 0) {
      return NextResponse.json({ message: 'No customers found' })
    }

    const churnThresholdDays = 90 // Consider churned if no appointment in 90 days

    for (const customer of customers) {
      // Get last appointment
      const { data: lastAppointment } = await supabase
        .from('appointments')
        .select('start_time')
        .eq('business_id', business.id)
        .eq('customer_id', customer.id)
        .in('status', ['scheduled', 'confirmed', 'completed'])
        .order('start_time', { ascending: false })
        .limit(1)
        .single()

      // Get total appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('business_id', business.id)
        .eq('customer_id', customer.id)
        .in('status', ['scheduled', 'confirmed', 'completed'])

      const totalAppointments = appointments?.length || 0
      const lastAppointmentDate = lastAppointment?.start_time 
        ? new Date(lastAppointment.start_time).toISOString().split('T')[0]
        : null

      const daysSinceLastAppointment = lastAppointmentDate
        ? Math.floor((new Date().getTime() - new Date(lastAppointmentDate).getTime()) / (1000 * 60 * 60 * 24))
        : null

      const isChurned = daysSinceLastAppointment !== null && daysSinceLastAppointment > churnThresholdDays

      // Upsert snapshot
      await supabase
        .from('churn_snapshots')
        .upsert({
          business_id: business.id,
          snapshot_date: snapshotDate,
          customer_id: customer.id,
          days_since_last_appointment: daysSinceLastAppointment,
          total_appointments: totalAppointments,
          last_appointment_date: lastAppointmentDate,
          is_churned: isChurned
        }, {
          onConflict: 'business_id,snapshot_date,customer_id'
        })

      // Generate suggestions for churned customers
      if (isChurned) {
        const { data: customerDetails } = await supabase
          .from('customers')
          .select('name, email, phone')
          .eq('id', customer.id)
          .single()

        const { data: existingSuggestion } = await supabase
          .from('churn_suggestions')
          .select('id')
          .eq('business_id', business.id)
          .eq('customer_id', customer.id)
          .is('viewed_at', null)
          .limit(1)
          .single()

        if (!existingSuggestion) {
          // Generate AI suggestion
          const openai = await getOpenAI()
          const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: 'You are a customer retention specialist. Generate actionable suggestions to re-engage churned customers.'
              },
              {
                role: 'user',
                content: `Customer: ${customerDetails?.name || 'Unknown'}
Last appointment: ${lastAppointmentDate || 'Never'}
Days since last appointment: ${daysSinceLastAppointment}
Total appointments: ${totalAppointments}

Generate a brief, actionable suggestion to re-engage this customer.`
              }
            ],
            temperature: 0.7
          })

          const suggestionText = completion.choices[0].message.content || ''

          await supabase
            .from('churn_suggestions')
            .insert({
              business_id: business.id,
              customer_id: customer.id,
              suggestion_text: suggestionText,
              priority: daysSinceLastAppointment && daysSinceLastAppointment > 180 ? 'high' : 'medium'
            })
        }
      }
    }

    return NextResponse.json({ 
      message: `Churn analysis completed for ${customers.length} customers`,
      snapshot_date: snapshotDate
    })
  } catch (error) {
    console.error('Error running churn analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
