# LocalPulse

AI-powered appointment booking and customer retention platform for local service businesses.

## Features

- 🤖 **AI Booking Assistant** - Natural language chatbot for 24/7 appointment booking
- 📅 **Smart Scheduling** - Intelligent availability solver with gap-filling heuristics
- 🔔 **Automated Reminders** - SMS and email reminders to reduce no-shows
- 📊 **Review Analytics** - AI-powered sentiment analysis and review summaries
- 🎯 **Churn Prevention** - Identify at-risk customers with actionable suggestions
- 🏢 **Multi-Tenant** - Manage multiple businesses with role-based access control
- 💳 **Stripe Integration** - Subscription billing with webhook handling
- ⚡ **Vercel-Optimized** - Built for serverless with background job processing

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Payments**: Stripe
- **AI**: OpenAI (GPT-4)
- **Deployment**: Vercel

## Local Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- OpenAI API key

### 1. Clone and Install

```bash
git clone <your-repo>
cd localpulse
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema:
   ```bash
   # Run supabase/schema.sql
   ```
3. Run the RLS policies:
   ```bash
   # Run supabase/policies.sql
   ```
4. (Optional) Seed development data:
   ```bash
   # Run supabase/seed.sql
   ```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase project settings (keep secret!)
- `STRIPE_SECRET_KEY` - From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe webhook settings
- `OPENAI_API_KEY` - From OpenAI platform

### 4. Set Up Stripe Products

1. Go to Stripe Dashboard > Products
2. Create products/prices for your subscription tiers:
   - Starter: $49/month
   - Professional: $149/month
   - Enterprise: Custom pricing
3. Copy the Price ID and set `NEXT_PUBLIC_STRIPE_PRICE_ID` (or use the checkout API with price IDs)

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Deploy

### 3. Set Up Vercel Cron

The `vercel.json` file includes a cron configuration (Hobby plan compatible - runs once daily). You can also set it up in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Cron Jobs"
3. Add a new cron job:
   - **Path**: `/api/jobs/dispatch`
   - **Schedule**: `0 9 * * *` (once daily at 9:00 AM UTC)

Alternatively, use the Vercel CLI:

```bash
vercel cron add "0 9 * * *" /api/jobs/dispatch
```

**Note**: The Hobby plan on Vercel limits cron jobs to run once per day maximum. The job dispatcher will process all due jobs in batches when it runs.

### 4. Configure Stripe Webhook

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Update App URL

Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

## Architecture

### Multi-Tenancy

- Every tenant-owned table includes `business_id`
- RLS policies enforce access control using `is_business_member()` helper
- Business membership required for all tenant data access

### Background Jobs

- Jobs table stores async tasks (reminders, churn snapshots, review summaries)
- `/api/jobs/dispatch` processes due jobs in batches
- Vercel Cron triggers dispatch once daily at 9:00 AM UTC (Hobby plan compatible)
- Jobs retry with exponential backoff (max 5 attempts)
- Use `enqueueJob()` helper from `@/lib/jobs` to create jobs

**Example:**
```typescript
import { enqueueJob } from '@/lib/jobs'

// Schedule a reminder email for tomorrow
await enqueueJob({
  businessId: 'your-business-id',
  type: 'reminders.send',
  runAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  payload: {
    channel: 'email',
    to: 'customer@example.com',
    subject: 'Appointment Reminder',
    message: 'Your appointment is tomorrow at 2pm',
    html: '<p>Your appointment is tomorrow at 2pm</p>'
  }
})
```

### API Routes

All routes use Node.js runtime for Stripe/OpenAI/Supabase Service Role access. Edge runtime is not used to maintain compatibility with these services.

### Notifications

Abstracted provider system:
- Default: Console logging (development)
- Twilio: SMS support (configure `TWILIO_*` env vars)
- SendGrid: Email support (configure `SENDGRID_*` env vars)

## How to Sell LocalPulse

### Target Niches

1. **HVAC Companies** - High-value services, seasonal demand, repeat customers
2. **Plumbing Services** - Emergency bookings, maintenance contracts
3. **Landscaping** - Seasonal scheduling, recurring services
4. **Auto Repair** - Appointment-based, customer retention critical
5. **Beauty Salons** - High appointment volume, customer loyalty programs
6. **Dental Practices** - Appointment-heavy, recall campaigns

### Pricing Tiers

**Starter ($49/month)**
- Up to 500 appointments/month
- Basic features
- Email support

**Professional ($149/month)**
- Unlimited appointments
- All AI features
- SMS reminders
- Priority support

**Enterprise (Custom)**
- Multi-location
- Custom integrations
- Dedicated support

### Outreach Scripts

#### Cold Email Template

```
Subject: Reduce No-Shows and Grow Your [Business Type] Business

Hi [Name],

I noticed [Business Name] offers [service]. Are you struggling with:
- Last-minute cancellations and no-shows?
- Time spent on phone calls for bookings?
- Losing customers to competitors?

LocalPulse helps businesses like yours:
✓ Reduce no-shows by 40% with automated reminders
✓ Book appointments 24/7 with AI chatbot
✓ Identify at-risk customers before they churn

[Business Type] businesses using LocalPulse see an average of:
- 30% reduction in no-shows
- 25% increase in repeat bookings
- 2 hours saved per day on scheduling

Would you be open to a 15-minute demo?

Best,
[Your Name]
```

#### LinkedIn Outreach

```
Hi [Name],

I help [business type] businesses reduce no-shows and increase repeat customers with AI-powered scheduling.

Would you be interested in seeing how [similar business] increased bookings by 25%?

[Link to case study or demo]
```

#### Follow-Up Sequence

1. **Day 1**: Initial outreach
2. **Day 3**: Share case study or testimonial
3. **Day 7**: Offer free trial or demo
4. **Day 14**: Final follow-up with pricing

### Sales Process

1. **Discovery Call** (15 min)
   - Understand current booking process
   - Identify pain points (no-shows, time spent, churn)
   - Assess volume and needs

2. **Demo** (30 min)
   - Show AI chatbot booking
   - Demonstrate smart scheduling
   - Walk through churn insights
   - Show review analytics

3. **Trial** (14 days)
   - Set up business profile
   - Import existing customers
   - Configure services and staff
   - Enable AI chatbot

4. **Onboarding** (1 hour)
   - Train team on platform
   - Set up reminders
   - Configure review ingestion
   - Enable Stripe subscription

### Key Metrics to Track

- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn Rate
- Net Promoter Score (NPS)

## API Documentation

### Core Endpoints

- `GET /api/businesses` - List user's businesses
- `POST /api/businesses` - Create business
- `GET /api/services?businessId=...` - List services
- `POST /api/services?businessId=...` - Create service
- `GET /api/appointments?businessId=...` - List appointments
- `POST /api/appointments?businessId=...` - Create appointment
- `POST /api/chatbot?businessId=...` - AI chatbot interaction
- `POST /api/reviews/summarize?businessId=...` - Generate review summary
- `POST /api/churn/run?businessId=...` - Run churn analysis

See route files in `src/app/api/` for full documentation.

## Development

### Project Structure

```
src/
├── app/
│   ├── (app)/          # Authenticated app routes
│   ├── (marketing)/    # Public marketing pages
│   ├── api/            # API routes
│   ├── login/          # Auth pages
│   └── signup/
├── components/         # React components
├── lib/               # Utilities
│   ├── supabase/      # Supabase clients
│   ├── business.ts    # Business helpers
│   ├── availability.ts # Scheduling logic
│   ├── jobs.ts        # Job queue helpers
│   └── notifications/ # Notification providers
└── supabase/          # Database files
    ├── schema.sql
    ├── policies.sql
    └── seed.sql
```

### Running Tests

```bash
npm run build  # TypeScript check
npm run lint   # ESLint check
```

### Database Migrations

When updating schema:
1. Update `supabase/schema.sql`
2. Run in Supabase SQL Editor
3. Update TypeScript types in `src/lib/supabase/database.types.ts`

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact support@localpulse.com
