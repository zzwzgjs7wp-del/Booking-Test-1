import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export interface Business {
  id: string
  name: string
  slug: string
  email: string | null
  phone: string | null
  address: string | null
  timezone: string
  created_at: string
  updated_at: string
}

/**
 * Get the active business from URL param or user's most recent business
 * Throws if user is not authenticated or not a member
 */
export async function requireBusiness(searchParams?: { businessId?: string }): Promise<Business> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  let businessId: string | null = null

  // Try to get from URL param first
  if (searchParams?.businessId) {
    businessId = searchParams.businessId
  } else {
    // Get user's most recent business
    const { data: memberships } = await supabase
      .from('business_members')
      .select('business_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (memberships && memberships.length > 0) {
      businessId = memberships[0].business_id
    }
  }

  if (!businessId) {
    redirect('/onboarding')
  }

  // Verify membership
  const { data: membership } = await supabase
    .from('business_members')
    .select('business_id')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    redirect('/onboarding')
  }

  // Get business details
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error || !business) {
    redirect('/onboarding')
  }

  return business
}

/**
 * Get all businesses the user is a member of
 */
export async function getUserBusinesses(): Promise<Business[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return []
  }

  const { data: memberships } = await supabase
    .from('business_members')
    .select('business_id')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) {
    return []
  }

  const businessIds = memberships.map(m => m.business_id)
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .in('id', businessIds)

  return businesses || []
}
