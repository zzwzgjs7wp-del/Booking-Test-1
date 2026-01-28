import { Suspense } from 'react'
import SettingsPageClient from './settings-client'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SettingsPageClient />
    </Suspense>
  )
}
