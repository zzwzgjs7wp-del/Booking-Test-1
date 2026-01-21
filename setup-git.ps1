# PowerShell script to initialize Git and prepare for GitHub push
# Run this script in PowerShell: .\setup-git.ps1

Write-Host "🚀 Setting up Git repository for ArcticPro HVAC" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

# Check if already a git repo
if (Test-Path .git) {
    Write-Host "⚠ Git repository already initialized" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "Adding files to Git..." -ForegroundColor Cyan
git add .
Write-Host "✓ Files added" -ForegroundColor Green

# Create initial commit
Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: ArcticPro HVAC website"
Write-Host "✓ Initial commit created" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a repository on GitHub.com" -ForegroundColor White
Write-Host "2. Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/arcticpro-hvac.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then deploy to Vercel:" -ForegroundColor Cyan
Write-Host "- Go to vercel.com and import your GitHub repository" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT.md for detailed instructions." -ForegroundColor Gray
