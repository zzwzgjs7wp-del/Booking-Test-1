#!/bin/bash
# Bash script to initialize Git and prepare for GitHub push
# Run this script: bash setup-git.sh

echo "🚀 Setting up Git repository for ArcticPro HVAC"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "✗ Git is not installed!"
    echo "Please install Git from: https://git-scm.com/downloads"
    exit 1
fi

echo "✓ Git found: $(git --version)"
echo ""

# Check if already a git repo
if [ -d .git ]; then
    echo "⚠ Git repository already initialized"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    echo "Initializing Git repository..."
    git init
    echo "✓ Git repository initialized"
fi

# Add all files
echo ""
echo "Adding files to Git..."
git add .
echo "✓ Files added"

# Create initial commit
echo ""
echo "Creating initial commit..."
git commit -m "Initial commit: ArcticPro HVAC website"
echo "✓ Initial commit created"

echo ""
echo "✅ Git setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub.com"
echo "2. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/arcticpro-hvac.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Then deploy to Vercel:"
echo "- Go to vercel.com and import your GitHub repository"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
