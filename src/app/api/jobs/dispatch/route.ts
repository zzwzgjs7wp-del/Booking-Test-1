import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendSMS, sendEmail } from '@/lib/notifications/provider'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const JobPayloadReminderSchema = z.object({
  channel: z.enum(['sms', 'email']),
  to: z.string().min(3),
  subject: z.string().optional(),
  message: z.string().min(1),
  html: z.string().optional(),
})

type JobRow = {
  id: string
  business_id: string
  type: string
  payload: any
  attempts: number
  max_attempts: number
}

async function processJob(job: JobRow) {
  switch (job.type) {
    case 'reminders.send': {
      const payload = JobPayloadReminderSchema.parse(job.payload)
      if (payload.channel === 'sms') {
        await sendSMS({ to: payload.to, message: payload.message })
      } else {
        await sendEmail({
          to: payload.to,
          subject: payload.subject ?? 'Reminder',
          html: payload.html,
          text: payload.message
        })
      }
      return
    }

    case 'churn.snapshot': {
      // Trigger churn analysis
      const businessId = job.business_id
      if (businessId) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/churn/run?businessId=${businessId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || ''}`
          }
        })
        if (!response.ok) {
          throw new Error(`Churn snapshot failed: ${response.statusText}`)
        }
      }
      return
    }

    case 'reviews.summarize': {
      // Trigger review summary
      const { periodStart, periodEnd } = job.payload as {
        periodStart: string
        periodEnd: string
      }
      const businessId = job.business_id
      if (businessId) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/reviews/summarize?businessId=${businessId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || ''}`
          },
          body: JSON.stringify({
            period_start: periodStart,
            period_end: periodEnd
          })
        })
        if (!response.ok) {
          throw new Error(`Review summary failed: ${response.statusText}`)
        }
      }
      return
    }

    default:
      throw new Error(`Unknown job type: ${job.type}`)
  }
}

export async function POST(req: NextRequest) {
  // Recommended: protect cron endpoint
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Use service role client to bypass RLS for job processing
  const supabase = await createServiceRoleClient()

  const batchSize = Number(process.env.JOBS_BATCH_SIZE ?? '20')

  // 1) Fetch due jobs (pending) and lock them by setting status=processing.
  // Important: we do a two-step approach that works well on Vercel without Postgres advisory locks.
  // Step A: read due jobs
  const { data: due, error: dueErr } = await supabase
    .from('jobs')
    .select('id,business_id,type,payload,attempts,max_attempts')
    .eq('status', 'pending')
    .lte('run_at', new Date().toISOString())
    .order('run_at', { ascending: true })
    .limit(batchSize)

  if (dueErr) {
    return NextResponse.json({ error: dueErr.message }, { status: 500 })
  }

  if (!due || due.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 })
  }

  // Step B: attempt to lock each by moving to processing if still pending
  const locked: JobRow[] = []
  const workerId = `vercel-${process.env.VERCEL_REGION ?? 'local'}`

  for (const j of due) {
    const { data: updated, error: lockErr } = await supabase
      .from('jobs')
      .update({
        status: 'processing',
        locked_at: new Date().toISOString(),
        locked_by: workerId,
      })
      .eq('id', j.id)
      .eq('status', 'pending')
      .select('id,business_id,type,payload,attempts,max_attempts')
      .maybeSingle()

    if (!lockErr && updated) locked.push(updated as JobRow)
  }

  let succeeded = 0
  let failed = 0

  for (const job of locked) {
    try {
      await processJob(job)

      await supabase
        .from('jobs')
        .update({
          status: 'succeeded',
          last_error: null,
          locked_at: null,
          locked_by: null,
        })
        .eq('id', job.id)

      succeeded++
    } catch (err: any) {
      const nextAttempts = (job.attempts ?? 0) + 1
      const terminal = nextAttempts >= (job.max_attempts ?? 5)

      await supabase
        .from('jobs')
        .update({
          attempts: nextAttempts,
          status: terminal ? 'failed' : 'pending',
          last_error: String(err?.message ?? err),
          // Exponential backoff: 5 min * attempts
          run_at: terminal
            ? new Date().toISOString()
            : new Date(Date.now() + 5 * 60 * 1000 * nextAttempts).toISOString(),
          locked_at: null,
          locked_by: null,
        })
        .eq('id', job.id)

      failed++
    }
  }

  return NextResponse.json({
    ok: true,
    locked: locked.length,
    succeeded,
    failed,
  })
}
