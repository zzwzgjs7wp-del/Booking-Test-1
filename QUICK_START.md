# Quick Start: Deploy in 5 Minutes

## Fastest Path to Deployment

### 1. Install Git (if needed)
Download: https://git-scm.com/downloads

### 2. Initialize & Push to GitHub

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/arcticpro-hvac.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `arcticpro-hvac` repository
5. Click "Deploy"
6. Done! Your site is live 🎉

---

## That's It!

Your website will be live at: `https://your-project.vercel.app`

**Next Steps:**
- Customize business info in `src/config/site.ts`
- Add your SMTP credentials in Vercel (Settings → Environment Variables)
- Set up a custom domain (optional)

See `DEPLOYMENT.md` for detailed instructions.
