#!/bin/bash
# Script to push job-inbox-os to GitHub

echo "🚀 Pushing job-inbox-os to GitHub..."
echo ""
echo "First, create a new repository on GitHub:"
echo "  1. Go to https://github.com/new"
echo "  2. Repository name: job-inbox-os"
echo "  3. Description: MVP to convert job emails into structured events"
echo "  4. Keep it Public or Private (your choice)"
echo "  5. DO NOT initialize with README (we already have one)"
echo "  6. Click 'Create repository'"
echo ""
read -p "Press Enter once you've created the repo..."
echo ""
read -p "Enter your GitHub username: " username
echo ""

# Add remote and push
git remote add origin "https://github.com/${username}/job-inbox-os.git"
git branch -M main
git push -u origin main

echo ""
echo "✅ Pushed to GitHub!"
echo "🔗 Your repo: https://github.com/${username}/job-inbox-os"
echo ""
echo "To clone on another machine:"
echo "  git clone https://github.com/${username}/job-inbox-os.git"