'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BusinessSwitcher } from '@/components/business-switcher'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Calendar, Users, Star, Settings, CreditCard } from 'lucide-react'

export function AppNavbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const businessId = searchParams.get('businessId')

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: null },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/reviews', label: 'Reviews', icon: Star },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              LocalPulse
            </Link>
            <div className="flex items-center gap-4">
              {navItems.map((item) => {
                const href = businessId ? `${item.href}?businessId=${businessId}` : item.href
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {businessId && <BusinessSwitcher currentBusinessId={businessId} />}
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
