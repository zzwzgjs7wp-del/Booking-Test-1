import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const enqueueJobSchema = z.object({
  businessId: z.string().uuid(),
  type: z.string().min(1),
  runAt: z.date().optional(),
  payload: z.record(z.any()),
})

export interface EnqueueJobParams {
  businessId: string
  type: string
  runAt?: Date
  payload: Record<string, any>
}

/**
 * Enqueue a background job for processing
 * 
 * @param params - Job parameters
 * @param params.businessId - The business ID this job belongs to
 * @param params.type - Job type (e.g., 'reminders.send', 'churn.snapshot', 'reviews.summarize')
 * @param params.runAt - Optional date/time to run the job (defaults to now)
 * @param params.payload - Job payload data
 * @returns The created job ID
 * 
 * @example
 * ```ts
 * await enqueueJob({
 *   businessId: '123e4567-e89b-12d3-a456-426614174000',
 *   type: 'reminders.send',
 *   runAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
 *   payload: {
 *     channel: 'email',
 *     to: 'customer@example.com',
 *     subject: 'Appointment Reminder',
 *     message: 'Your appointment is tomorrow at 2pm'
 *   }
 * })
 * ```
 */
export async function enqueueJob(params: EnqueueJobParams): Promise<string> {
  const supabase = await createClient()
  
  // Validate input
  const validated = enqueueJobSchema.parse(params)
  const { businessId, type, runAt, payload } = validated

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      business_id: businessId,
      type,
      run_at: (runAt ?? new Date()).toISOString(),
      payload,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to enqueue job: ${error.message}`)
  }

  if (!data) {
    throw new Error('Failed to enqueue job: No data returned')
  }

  return data.id
}

/**
 * Cancel a pending job
 */
export async function cancelJob(jobId: string, businessId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jobs')
    .update({ status: 'cancelled' })
    .eq('id', jobId)
    .eq('business_id', businessId)
    .in('status', ['pending', 'processing'])

  if (error) {
    throw new Error(`Failed to cancel job: ${error.message}`)
  }
}

/**
 * Get jobs for a business
 */
export async function getBusinessJobs(
  businessId: string,
  options?: {
    status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
    type?: string
    limit?: number
  }
): Promise<any[]> {
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`)
  }

  return data || []
}
