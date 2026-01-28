import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireBusiness } from '@/lib/business'
import { calculateAvailability, findBestSlot } from '@/lib/availability'
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

const chatbotSchema = z.object({
  message: z.string().min(1),
  conversation_history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = chatbotSchema.parse(body)
    const url = new URL(request.url)
    const businessId = url.searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const business = await requireBusiness({ businessId })
    const supabase = await createClient()

    // Get business context
    const { data: services } = await supabase
      .from('services')
      .select('id, name, description, duration_minutes, price_cents')
      .eq('business_id', business.id)
      .eq('is_active', true)

    const { data: staff } = await supabase
      .from('staff')
      .select('id, name')
      .eq('business_id', business.id)
      .eq('is_active', true)

    // Build tools for OpenAI
    const tools = [
      {
        type: 'function' as const,
        function: {
          name: 'listServices',
          description: 'List all available services offered by the business',
          parameters: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'listAvailableSlots',
          description: 'Get available appointment time slots for a service',
          parameters: {
            type: 'object',
            properties: {
              serviceId: {
                type: 'string',
                description: 'The ID of the service'
              },
              startDate: {
                type: 'string',
                description: 'Start date in ISO format (e.g., 2024-01-01T00:00:00Z)'
              },
              endDate: {
                type: 'string',
                description: 'End date in ISO format (e.g., 2024-01-31T23:59:59Z)'
              },
              staffId: {
                type: 'string',
                description: 'Optional staff member ID'
              }
            },
            required: ['serviceId', 'startDate', 'endDate']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'createAppointment',
          description: 'Create a new appointment',
          parameters: {
            type: 'object',
            properties: {
              customerName: {
                type: 'string',
                description: 'Customer name'
              },
              customerEmail: {
                type: 'string',
                description: 'Customer email'
              },
              customerPhone: {
                type: 'string',
                description: 'Customer phone number'
              },
              serviceId: {
                type: 'string',
                description: 'The ID of the service'
              },
              startTime: {
                type: 'string',
                description: 'Start time in ISO format'
              },
              endTime: {
                type: 'string',
                description: 'End time in ISO format'
              },
              staffId: {
                type: 'string',
                description: 'Optional staff member ID'
              }
            },
            required: ['customerName', 'serviceId', 'startTime', 'endTime']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'rescheduleAppointment',
          description: 'Reschedule an existing appointment',
          parameters: {
            type: 'object',
            properties: {
              appointmentId: {
                type: 'string',
                description: 'The ID of the appointment to reschedule'
              },
              startTime: {
                type: 'string',
                description: 'New start time in ISO format'
              },
              endTime: {
                type: 'string',
                description: 'New end time in ISO format'
              }
            },
            required: ['appointmentId', 'startTime', 'endTime']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'cancelAppointment',
          description: 'Cancel an existing appointment',
          parameters: {
            type: 'object',
            properties: {
              appointmentId: {
                type: 'string',
                description: 'The ID of the appointment to cancel'
              }
            },
            required: ['appointmentId']
          }
        }
      }
    ]

    // Build system message
    const systemMessage = `You are a helpful AI assistant for ${business.name}, a local service business. 
You help customers book appointments, reschedule, and cancel appointments.
Available services: ${services?.map(s => `${s.name} (${s.duration_minutes} min, $${(s.price_cents || 0) / 100})`).join(', ')}
Available staff: ${staff?.map(s => s.name).join(', ')}
Always be friendly, professional, and helpful.`

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemMessage },
      ...(validated.conversation_history || []).map(msg => ({
        role: msg.role,
        content: msg.content
      })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      { role: 'user', content: validated.message }
    ]

    const openai = await getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      tools,
      tool_choice: 'auto'
    })

    const responseMessage = completion.choices[0].message

    // Handle tool calls
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolResults = []

      for (const toolCall of responseMessage.tool_calls) {
        try {
          let result: any

          switch (toolCall.function.name) {
            case 'listServices':
              result = { services: services || [] }
              break

            case 'listAvailableSlots': {
              const args = JSON.parse(toolCall.function.arguments)
              const slots = await calculateAvailability(supabase, {
                businessId: business.id,
                serviceId: args.serviceId,
                startDate: new Date(args.startDate),
                endDate: new Date(args.endDate),
                staffId: args.staffId
              })
              result = { slots: slots.map(s => ({
                start: s.start.toISOString(),
                end: s.end.toISOString(),
                staffId: s.staffId
              })) }
              break
            }

            case 'createAppointment': {
              const args = JSON.parse(toolCall.function.arguments)
              
              // Find or create customer
              let customer
              const { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('business_id', business.id)
                .or(`email.eq.${args.customerEmail || 'null'},phone.eq.${args.customerPhone || 'null'}`)
                .limit(1)
                .single()

              if (existingCustomer) {
                customer = existingCustomer
              } else {
                const { data: newCustomer } = await supabase
                  .from('customers')
                  .insert({
                    business_id: business.id,
                    name: args.customerName,
                    email: args.customerEmail,
                    phone: args.customerPhone
                  })
                  .select()
                  .single()
                customer = newCustomer
              }

              const { data: appointment } = await supabase
                .from('appointments')
                .insert({
                  business_id: business.id,
                  customer_id: customer.id,
                  service_id: args.serviceId,
                  staff_id: args.staffId || null,
                  start_time: args.startTime,
                  end_time: args.endTime,
                  status: 'scheduled'
                })
                .select()
                .single()

              result = { appointment }
              break
            }

            case 'rescheduleAppointment': {
              const args = JSON.parse(toolCall.function.arguments)
              const { data: appointment } = await supabase
                .from('appointments')
                .update({
                  start_time: args.startTime,
                  end_time: args.endTime
                })
                .eq('id', args.appointmentId)
                .eq('business_id', business.id)
                .select()
                .single()

              result = { appointment }
              break
            }

            case 'cancelAppointment': {
              const args = JSON.parse(toolCall.function.arguments)
              const { data: appointment } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', args.appointmentId)
                .eq('business_id', business.id)
                .select()
                .single()

              result = { appointment }
              break
            }
          }

          toolResults.push({
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          })
        } catch (error: any) {
          toolResults.push({
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: error.message })
          })
        }
      }

      // Get final response with tool results
      const finalMessages = [
        ...messages,
        responseMessage,
        ...toolResults
      ]

      const finalCompletion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: finalMessages
      })

      return NextResponse.json({
        message: finalCompletion.choices[0].message.content,
        tool_calls: responseMessage.tool_calls
      })
    }

    return NextResponse.json({
      message: responseMessage.content
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error in chatbot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
