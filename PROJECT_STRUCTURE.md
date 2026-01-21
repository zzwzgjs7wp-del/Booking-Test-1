# Project Structure

```
arcticpro-hvac/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── api/
│   │   │   └── lead/
│   │   │       └── route.ts         # Form submission API endpoint
│   │   ├── about/
│   │   │   └── page.tsx             # About page
│   │   ├── book/
│   │   │   └── page.tsx             # Booking/Request Service page
│   │   ├── contact/
│   │   │   └── page.tsx             # Contact page
│   │   ├── financing/
│   │   │   └── page.tsx             # Financing page
│   │   ├── service-areas/
│   │   │   └── page.tsx             # Service areas page
│   │   ├── services/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx         # Dynamic service detail pages
│   │   │   └── page.tsx             # Services overview page
│   │   ├── globals.css              # Global styles + Tailwind
│   │   ├── layout.tsx               # Root layout with Navbar/Footer
│   │   ├── not-found.tsx            # 404 page
│   │   ├── page.tsx                 # Home page
│   │   ├── robots.ts                # Robots.txt generator
│   │   └── sitemap.ts               # Sitemap generator
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── button.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   └── textarea.tsx
│   │   ├── booking-form.tsx         # Multi-step booking form
│   │   ├── contact-form.tsx         # Contact form
│   │   ├── cta-button.tsx           # Reusable CTA button component
│   │   ├── footer.tsx               # Site footer
│   │   ├── navbar.tsx               # Navigation bar
│   │   ├── sticky-cta.tsx           # Mobile sticky CTA bar
│   │   └── testimonial-card.tsx     # Testimonial card component
│   ├── config/
│   │   ├── site.ts                  # Business configuration (name, phone, etc.)
│   │   └── services.ts              # Services data and definitions
│   └── lib/
│       └── utils.ts                 # Utility functions (cn helper)
├── data/                            # Created at runtime - form submissions
│   └── leads.json                   # Stored form submissions
├── public/                          # Static assets (add images here)
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Git ignore rules
├── env.example.txt                  # Environment variables example
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── README.md                        # Main documentation
├── tailwind.config.ts               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## Key Files to Customize

### Business Information
- **`src/config/site.ts`** - Update company name, phone, email, address, service area, business hours

### Services
- **`src/config/services.ts`** - Add/remove services, update descriptions, features, benefits

### Styling
- **`src/app/globals.css`** - Color scheme, CSS variables
- **`tailwind.config.ts`** - Tailwind theme customization

### Pages
- All pages in `src/app/` can be customized
- Home page: `src/app/page.tsx`
- Service pages: `src/app/services/[slug]/page.tsx`

## Environment Variables

Create `.env.local` from `env.example.txt`:
- SMTP settings (optional - for email notifications)
- Site URL (for production)

## Form Submissions

- Saved to: `data/leads.json` (created automatically)
- Email sent to: Configured SMTP address (if set up)
- API endpoint: `/api/lead`

## SEO Files

- Sitemap: `/sitemap.xml` (auto-generated)
- Robots: `/robots.txt` (auto-generated)
- JSON-LD: Home page includes LocalBusiness schema
- Meta tags: All pages include proper metadata
