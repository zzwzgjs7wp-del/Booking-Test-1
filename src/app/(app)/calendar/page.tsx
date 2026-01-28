import { Suspense } from 'react'
import CalendarPageClient from './calendar-client'

export const dynamic = 'force-dynamic'

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <CalendarPageClient />
    </Suspense>
  )
}
