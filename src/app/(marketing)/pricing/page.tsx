import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 500 appointments/month',
        'AI booking chatbot',
        'Basic scheduling',
        'Email support',
        'Review analytics',
      ],
    },
    {
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Unlimited appointments',
        'AI booking chatbot',
        'Smart scheduling',
        'SMS & email reminders',
        'Churn prevention insights',
        'Review analytics & summaries',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large operations',
      features: [
        'Everything in Professional',
        'Multi-location support',
        'Custom integrations',
        'Dedicated account manager',
        'Custom AI training',
        'SLA guarantee',
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that works for your business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`p-8 ${plan.popular ? 'border-primary border-2' : ''}`}
          >
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-muted-foreground mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
