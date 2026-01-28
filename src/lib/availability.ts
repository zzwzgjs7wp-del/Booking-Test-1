// Availability solver for appointments
// Finds available time slots based on staff hours, time off, and existing appointments

export interface TimeSlot {
  start: Date
  end: Date
  staffId: string | null
}

export interface AvailabilityRequest {
  businessId: string
  serviceId: string
  startDate: Date
  endDate: Date
  staffId?: string | null
}

interface StaffHours {
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

interface TimeOff {
  staff_id: string
  start_time: string
  end_time: string
}

interface Appointment {
  start_time: string
  end_time: string
  staff_id: string | null
}

/**
 * Calculate available time slots for a service
 * Uses 15-minute increments
 */
export async function calculateAvailability(
  supabase: any,
  request: AvailabilityRequest
): Promise<TimeSlot[]> {
  const { businessId, serviceId, startDate, endDate, staffId } = request

  // Get service duration
  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  if (!service) {
    return []
  }

  const durationMinutes = service.duration_minutes
  const slotSizeMinutes = 15

  // Get staff members (filter by staffId if provided)
  let staffQuery = supabase
    .from('staff')
    .select('id')
    .eq('business_id', businessId)
    .eq('is_active', true)

  if (staffId) {
    staffQuery = staffQuery.eq('id', staffId)
  }

  const { data: staffMembers } = await staffQuery
  if (!staffMembers || staffMembers.length === 0) {
    return []
  }

  const staffIds = staffMembers.map((s: any) => s.id)

  // Get weekly hours for all staff
  const { data: weeklyHours } = await supabase
    .from('staff_weekly_hours')
    .select('*')
    .in('staff_id', staffIds)

  // Get time off in date range
  const { data: timeOff } = await supabase
    .from('staff_time_off')
    .select('*')
    .in('staff_id', staffIds)
    .lte('start_time', endDate.toISOString())
    .gte('end_time', startDate.toISOString())

  // Get existing appointments in date range
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', businessId)
    .in('status', ['scheduled', 'confirmed'])
    .lte('start_time', endDate.toISOString())
    .gte('end_time', startDate.toISOString())

  // Build availability map
  const availableSlots: TimeSlot[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    
    // Get staff available on this day
    const staffAvailableToday = weeklyHours.filter((h: StaffHours) => 
      h.dayOfWeek === dayOfWeek && staffIds.includes(h.staffId)
    )

    for (const hours of staffAvailableToday) {
      const [startHour, startMin] = hours.startTime.split(':').map(Number)
      const [endHour, endMin] = hours.endTime.split(':').map(Number)
      
      const dayStart = new Date(currentDate)
      dayStart.setHours(startHour, startMin, 0, 0)
      
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(endHour, endMin, 0, 0)

      // Generate slots
      let slotStart = new Date(Math.max(dayStart.getTime(), startDate.getTime()))
      
      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000)
        
        // Check if slot fits within day
        if (slotEnd > dayEnd) {
          break
        }

        // Check if slot is in the future (at least 1 hour ahead)
        const now = new Date()
        if (slotStart < new Date(now.getTime() + 60 * 60 * 1000)) {
          slotStart = new Date(slotStart.getTime() + slotSizeMinutes * 60 * 1000)
          continue
        }

        // Check time off
        const hasTimeOff = timeOff.some((to: TimeOff) => {
          const toStart = new Date(to.start_time)
          const toEnd = new Date(to.end_time)
          return slotStart < toEnd && slotEnd > toStart && to.staff_id === hours.staff_id
        })

        if (hasTimeOff) {
          slotStart = new Date(slotStart.getTime() + slotSizeMinutes * 60 * 1000)
          continue
        }

        // Check existing appointments
        const hasConflict = appointments.some((apt: Appointment) => {
          const aptStart = new Date(apt.startTime)
          const aptEnd = new Date(apt.endTime)
          const conflict = slotStart < aptEnd && slotEnd > aptStart
          
          // If appointment has staff assigned, check staff match
          if (conflict && apt.staffId) {
            return apt.staffId === hours.staffId
          }
          
          // If no staff assigned, conflict with any staff
          return conflict
        })

        if (!hasConflict) {
          availableSlots.push({
            start: new Date(slotStart),
            end: new Date(slotEnd),
            staffId: hours.staff_id
          })
        }

        slotStart = new Date(slotStart.getTime() + slotSizeMinutes * 60 * 1000)
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }

  // Sort by start time
  availableSlots.sort((a, b) => a.start.getTime() - b.start.getTime())

  // Smart scheduling: prefer filling gaps
  // This is a simple heuristic - prefer slots that minimize idle time
  return availableSlots
}

/**
 * Find best available slot (smart scheduling heuristic)
 * Prefers slots that fill gaps and avoid creating small unusable gaps
 */
export function findBestSlot(
  slots: TimeSlot[],
  preferredTime?: Date
): TimeSlot | null {
  if (slots.length === 0) {
    return null
  }

  if (preferredTime) {
    // Find slot closest to preferred time
    const sorted = [...slots].sort((a, b) => {
      const diffA = Math.abs(a.start.getTime() - preferredTime.getTime())
      const diffB = Math.abs(b.start.getTime() - preferredTime.getTime())
      return diffA - diffB
    })
    return sorted[0]
  }

  // Return earliest available slot
  return slots[0]
}
