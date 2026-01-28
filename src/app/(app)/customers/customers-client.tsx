'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

export default function CustomersPageClient() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!businessId) return

    fetch(`/api/customers?businessId=${businessId}`)
      .then(res => res.json())
      .then(data => {
        setCustomers(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching customers:', err)
        setLoading(false)
      })
  }, [businessId])

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button>Add Customer</Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="p-6">
            <h3 className="font-semibold text-lg mb-2">{customer.name}</h3>
            {customer.email && (
              <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
            )}
            {customer.phone && (
              <p className="text-sm text-muted-foreground mb-1">{customer.phone}</p>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              Joined {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No customers found</p>
        </div>
      )}
    </div>
  )
}
