#!/bin/bash

# Quick Deployment Script for Viberloop Firebase Fix
# This ensures the latest index.html is deployed and clears caching issues

echo "🔄 Viberloop Deployment Script"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found"
    echo "   Please run this script from the viberloop directory"
    exit 1
fi

echo "✅ Found firebase.json"
echo ""

# Show current Firebase project
echo "📋 Current Firebase project:"
firebase projects:list 2>/dev/null || echo "⚠️  Firebase CLI not found or not logged in"
echo ""

# Verify the fix is in place
echo "🔍 Verifying index.html has correct links..."
if grep -q "window.location.href = '/app'" index.html; then
    echo "✅ index.html has correct Firebase links"
else
    echo "❌ index.html still has old standalone links"
    echo "   Pulling latest changes..."
    git pull origin claude/viberloop-bio-dapp-ios-671QR
fi
echo ""

# Show what will be deployed
echo "📦 Files to be deployed:"
echo "   - index.html (landing page)"
echo "   - viberloop.html (field app)"
echo "   - dashboard.html (dashboard)"
echo ""
echo "🚫 Files excluded from deployment:"
echo "   - viberloop-standalone.html"
echo "   - dashboard-standalone.html"
echo "   - demo.html"
echo ""

# Deploy
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your app is live at:"
    echo "   Landing:   https://viberloop-bio.web.app/"
    echo "   Field App: https://viberloop-bio.web.app/app"
    echo "   Dashboard: https://viberloop-bio.web.app/dashboard"
    echo ""
    echo "⚠️  IMPORTANT: Clear your browser cache!"
    echo "   - Press Ctrl+Shift+R (Windows/Linux)"
    echo "   - Press Cmd+Shift+R (Mac)"
    echo "   - Or use incognito/private window"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "   Please check the error messages above"
    exit 1
fi
