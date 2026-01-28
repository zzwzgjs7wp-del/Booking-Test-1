import { Suspense } from 'react'
import OnboardingPageClient from './onboarding-client'

export const dynamic = 'force-dynamic'

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background px-4">Loading...</div>}>
      <OnboardingPageClient />
    </Suspense>
  )
}
