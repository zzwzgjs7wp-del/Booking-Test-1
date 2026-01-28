'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId')
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!businessId) return

    fetch(`/api/businesses?businessId=${businessId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setBusiness(data.data[0])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching business:', err)
        setLoading(false)
      })
  }, [businessId])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Business Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" defaultValue={business?.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={business?.email || ''} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" defaultValue={business?.phone || ''} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue={business?.address || ''} />
          </div>
          <Button disabled={saving}>Save Changes</Button>
        </div>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SettingsPageContent />
    </Suspense>
  )
}
