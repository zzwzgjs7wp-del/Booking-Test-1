'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Appointment {
  id: string
  start_time: string
  end_time: string
  status: string
  customer: { name: string; email?: string; phone?: string }
  service: { name: string; duration_minutes: number }
  staff: { name: string } | null
}

export default function CalendarPageClient() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (!businessId) return

    const startDate = new Date(selectedDate)
    startDate.setDate(startDate.getDate() - 7)
    const endDate = new Date(selectedDate)
    endDate.setDate(endDate.getDate() + 30)

    fetch(`/api/appointments?businessId=${businessId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .then(res => res.json())
      .then(data => {
        setAppointments(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching appointments:', err)
        setLoading(false)
      })
  }, [businessId, selectedDate])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const appointmentsByDate = appointments.reduce((acc, apt) => {
    const date = new Date(apt.start_time).toISOString().split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(apt)
    return acc
  }, {} as Record<string, Appointment[]>)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button>New Appointment</Button>
      </div>

      <div className="space-y-6">
        {Object.entries(appointmentsByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, apts]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-4">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <div className="space-y-2">
                {apts.map((apt) => (
                  <Card key={apt.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{apt.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{apt.service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.start_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })} - {new Date(apt.end_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        {apt.staff && (
                          <p className="text-sm text-muted-foreground">Staff: {apt.staff.name}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
