# ArcticPro HVAC Website

A production-ready HVAC company website built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🚀 **Next.js 14** with App Router
- 📱 **Mobile-first** responsive design
- ⚡ **Fast performance** with optimized loading
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui
- 📧 **Contact & Booking Forms** with validation
- 📧 **Email Integration** via Nodemailer (optional)
- 🔍 **SEO Optimized** with metadata, JSON-LD, sitemap, and robots.txt
- 📝 **TypeScript** for type safety
- 🎯 **Local SEO** ready with structured data

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your SMTP credentials if you want email notifications. If not configured, form submissions will still be saved to `data/leads.json`.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Customization

### Business Information

Edit `src/config/site.ts` to update:
- Company name
- Phone number
- Email address
- Physical address
- Service area
- Business hours
- Social media links
- SEO defaults

### Services

Edit `src/config/services.ts` to:
- Add/remove services
- Update service descriptions
- Modify service features and benefits

### Styling

- Colors: Edit `src/app/globals.css` to change the color scheme
- Components: All components are in `src/components/`
- Tailwind config: `tailwind.config.ts`

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── services/     # Service pages
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...
│   ├── config/          # Configuration files
│   │   ├── site.ts      # Business info
│   │   └── services.ts  # Services data
│   └── lib/            # Utility functions
├── data/               # Form submissions (created at runtime)
├── public/            # Static assets
└── ...
```

## Form Submissions

Form submissions are handled in two ways:

1. **File Storage**: All submissions are saved to `data/leads.json` (created automatically)
2. **Email**: If SMTP is configured, emails are sent to the configured address

### Viewing Submissions

- Check `data/leads.json` for all form submissions
- If SMTP is configured, check your email inbox

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables:**
   - In Vercel project settings, add your SMTP variables if needed
   - Add `NEXT_PUBLIC_SITE_URL` with your production URL

4. **Deploy:**
   - Click "Deploy"
   - Your site will be live in minutes!

### Other Platforms

This Next.js app can be deployed to:
- **Netlify**: Use Next.js plugin
- **AWS Amplify**: Connect your Git repository
- **Railway**: One-click deploy
- **Self-hosted**: Build with `npm run build` and run with `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SMTP_HOST` | SMTP server hostname | No |
| `SMTP_PORT` | SMTP server port | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP password | No |
| `SMTP_FROM` | Email sender address | No |
| `SMTP_TO` | Email recipient address | No |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | No |

## SEO Features

- ✅ Meta tags on all pages
- ✅ Open Graph tags
- ✅ JSON-LD structured data (LocalBusiness schema)
- ✅ XML sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Semantic HTML
- ✅ Fast loading times

## Performance

- Optimized images (when added)
- Code splitting
- Server-side rendering
- Static generation where possible

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary. All rights reserved.

## Support

For questions or issues, contact: service@arcticprohvac.com

---

Built with ❤️ for ArcticPro HVAC
