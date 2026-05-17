#!/bin/bash

# Deploy Database Rules Only
# This script deploys ONLY the database rules to fix permission issues

echo "🔐 Firebase Database Rules Deployment"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found"
    echo "   Please run this script from the viberloop directory"
    exit 1
fi

if [ ! -f "database.rules.json" ]; then
    echo "❌ Error: database.rules.json not found"
    exit 1
fi

echo "✅ Found required files"
echo ""

# Show current rules
echo "📋 Current database rules:"
cat database.rules.json
echo ""

# Check Firebase login status
echo "🔍 Checking Firebase authentication..."
if ! firebase projects:list >/dev/null 2>&1; then
    echo "❌ Not authenticated with Firebase"
    echo ""
    echo "Please run: firebase login"
    echo ""
    exit 1
fi

echo "✅ Authenticated with Firebase"
echo ""

# Deploy
echo "🚀 Deploying database rules..."
firebase deploy --only database

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database rules deployed successfully!"
    echo ""
    echo "📊 Changes applied:"
    echo "   - /transactions: read/write enabled for all users"
    echo ""
    echo "💡 You can now submit transactions without permission errors"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "   Please check the error messages above"
    exit 1
fi
