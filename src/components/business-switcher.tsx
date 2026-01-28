'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
}

export function BusinessSwitcher({ currentBusinessId }: { currentBusinessId?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch('/api/businesses')
        const data = await res.json()
        if (data.data) {
          setBusinesses(data.data)
          const current = data.data.find((b: Business) => b.id === currentBusinessId) || data.data[0]
          setCurrentBusiness(current)
        }
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBusinesses()
  }, [currentBusinessId])

  const handleSwitch = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  if (loading || !currentBusiness) {
    return <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {currentBusiness.name}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {businesses.map((business) => (
          <DropdownMenuItem
            key={business.id}
            onClick={() => handleSwitch(business.id)}
            className={business.id === currentBusiness.id ? 'bg-accent' : ''}
          >
            {business.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
