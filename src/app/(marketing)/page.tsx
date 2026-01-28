import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          AI-Powered Appointment Booking & Customer Retention
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          LocalPulse helps local service businesses automate bookings, understand customers, and reduce churn with AI.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to grow</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">AI Booking Assistant</h3>
            <p className="text-muted-foreground">
              Let customers book appointments 24/7 with our intelligent chatbot that understands natural language.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Automatically find the best time slots, fill gaps, and optimize your team's schedule.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Churn Prevention</h3>
            <p className="text-muted-foreground">
              Get AI-powered insights on at-risk customers and actionable suggestions to keep them coming back.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Review Analytics</h3>
            <p className="text-muted-foreground">
              Understand customer sentiment with AI-powered review summaries and trend analysis.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Multi-Location</h3>
            <p className="text-muted-foreground">
              Manage multiple businesses from one dashboard with role-based access control.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Automated Reminders</h3>
            <p className="text-muted-foreground">
              Reduce no-shows with SMS and email reminders sent automatically before appointments.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center bg-muted rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-8">
          Join local service businesses using LocalPulse to grow their customer base.
        </p>
        <Button asChild size="lg">
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </section>
    </div>
  )
}
