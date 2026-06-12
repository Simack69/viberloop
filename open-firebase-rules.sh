#!/bin/bash
# Viberloop Bio - Open Firebase Rules for Testing
# This script temporarily opens Firebase Realtime Database rules
# to allow testing without authentication.
#
# WARNING: This makes your database PUBLIC!
# Only use for testing. Run restore-firebase-rules.sh when done.

set -e  # Exit on error

echo "🔧 Opening Firebase Rules for Testing..."
echo ""
echo "⚠️  WARNING: This will make your database PUBLIC!"
echo "⚠️  Only use for testing purposes."
echo ""

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found!"
    echo "   Please run this script from the viberloop project directory."
    exit 1
fi

# Backup current rules
if [ -f "database.rules.json" ]; then
    cp database.rules.json database.rules.json.backup
    echo "✅ Backed up current rules to database.rules.json.backup"
fi

# Create open rules
cat > database.rules.json << 'EOF'
{
  "rules": {
    "transactions": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp", "role", "customer"]
    },
    "users": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
EOF

echo "✅ Created open rules in database.rules.json"
echo ""

# Deploy rules
echo "📤 Deploying to Firebase..."
firebase deploy --only database

echo ""
echo "✅ Firebase rules deployed successfully!"
echo ""
echo "🎯 Your database is now open for testing."
echo ""
echo "Next steps:"
echo "  1. Wait 10-20 seconds for rules to propagate"
echo "  2. Refresh V2: https://viberloop-bio.firebaseapp.com/v2/"
echo "  3. Submit a transaction"
echo "  4. Should see: ✅ Transaction saved successfully!"
echo ""
echo "⚠️  IMPORTANT: Run ./restore-firebase-rules.sh when done testing!"
echo ""
