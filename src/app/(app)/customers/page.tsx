import { Suspense } from 'react'
import CustomersPageClient from './customers-client'

export const dynamic = 'force-dynamic'

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <CustomersPageClient />
    </Suspense>
  )
}
