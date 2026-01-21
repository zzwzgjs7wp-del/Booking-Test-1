# Deployment Guide: GitHub + Vercel

This guide will walk you through pushing your code to GitHub and deploying to Vercel.

## Prerequisites

1. **Git** - [Download Git](https://git-scm.com/downloads) if not installed
2. **GitHub Account** - [Sign up](https://github.com) if you don't have one
3. **Vercel Account** - [Sign up](https://vercel.com) (free tier available)

---

## Step 1: Install Git (if needed)

1. Download Git from: https://git-scm.com/downloads
2. Install with default settings
3. Restart your terminal/command prompt

Verify installation:
```bash
git --version
```

---

## Step 2: Initialize Git Repository

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ArcticPro HVAC website"
```

---

## Step 3: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository settings:
   - **Name**: `arcticpro-hvac` (or your preferred name)
   - **Description**: "Production-ready HVAC company website built with Next.js 14"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

---

## Step 4: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/arcticpro-hvac.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You may be prompted for GitHub credentials. Use a Personal Access Token if 2FA is enabled.

### Creating a Personal Access Token (if needed)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token and use it as your password when pushing

---

## Step 5: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in (use GitHub to sign in for easier setup)

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository**:
   - Find `arcticpro-hvac` in the list
   - Click **"Import"**

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Environment Variables** (Optional - for email):
   - Click "Environment Variables"
   - Add these if you want email notifications:
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASS=your-app-password
     SMTP_FROM=service@arcticprohvac.com
     SMTP_TO=service@arcticprohvac.com
     NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
     ```
   - Click "Add" for each variable

6. **Deploy**:
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your settings
   - Your site will deploy!

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

---

## Step 6: Configure Custom Domain (Optional)

1. In Vercel dashboard → Your project → Settings → Domains
2. Add your domain (e.g., `arcticprohvac.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

---

## Step 7: Update Site URL

After deployment, update your site URL in:

1. **Vercel Environment Variables**:
   - Add/update: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`

2. **Update sitemap.ts** (if using custom domain):
   - Edit `src/app/sitemap.ts`
   - Change `baseUrl` to your actual domain

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. Vercel will automatically build and deploy!

---

## Troubleshooting

### Build Errors

- Check Vercel build logs in the dashboard
- Ensure all dependencies are in `package.json`
- Check Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working

- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Form Submissions Not Working

- Check `data/leads.json` file (if using file storage)
- Verify SMTP credentials if using email
- Check Vercel function logs for errors

### 404 Errors

- Ensure all routes are properly exported
- Check `next.config.js` for any redirects
- Verify file structure matches Next.js App Router conventions

---

## Quick Reference Commands

```bash
# Initialize and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/arcticpro-hvac.git
git branch -M main
git push -u origin main

# Make changes and push updates
git add .
git commit -m "Update description"
git push

# Deploy with Vercel CLI
vercel
vercel --prod
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Docs**: https://docs.github.com

---

**Your site will be live in minutes!** 🚀
