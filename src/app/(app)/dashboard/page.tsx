import { redirect } from 'next/navigation'
import { requireBusiness } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { businessId?: string }
}) {
  const business = await requireBusiness(searchParams)
  const supabase = await createClient()

  // Get stats
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, status')
    .eq('business_id', business.id)
    .gte('start_time', new Date().toISOString())

  const upcomingAppointments = appointments?.filter(a => 
    ['scheduled', 'confirmed'].includes(a.status)
  ).length || 0

  const { data: customers } = await supabase
    .from('customers')
    .select('id')
    .eq('business_id', business.id)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const { data: churnSuggestions } = await supabase
    .from('churn_suggestions')
    .select('id')
    .eq('business_id', business.id)
    .is('viewed_at', null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Appointments</h3>
          <p className="text-3xl font-bold">{upcomingAppointments}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Customers</h3>
          <p className="text-3xl font-bold">{customers?.length || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Rating</h3>
          <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Churn Alerts</h3>
          <p className="text-3xl font-bold">{churnSuggestions?.length || 0}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Activity feed coming soon...</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href={`/calendar?businessId=${business.id}`}
              className="block p-3 border rounded-md hover:bg-accent"
            >
              View Calendar
            </a>
            <a
              href={`/customers?businessId=${business.id}`}
              className="block p-3 border rounded-md hover:bg-accent"
            >
              Manage Customers
            </a>
            <a
              href={`/reviews?businessId=${business.id}`}
              className="block p-3 border rounded-md hover:bg-accent"
            >
              View Reviews
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
