#!/bin/bash
# Viberloop Bio - Restore Secure Firebase Rules
# This script restores secure Firebase Realtime Database rules
# that require authentication.
#
# Run this after testing to secure your database.

set -e  # Exit on error

echo "🔒 Restoring Secure Firebase Rules..."
echo ""

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found!"
    echo "   Please run this script from the viberloop project directory."
    exit 1
fi

# Create secure rules
cat > database.rules.json << 'EOF'
{
  "rules": {
    "transactions": {
      ".read": "auth != null",
      ".write": "auth != null && !data.exists() && newData.child('role').val() === root.child('users').child(auth.uid).child('role').val()",
      ".indexOn": ["timestamp", "role", "customer"],
      "$transactionId": {
        ".validate": "newData.hasChildren(['customer', 'transactionDate', 'purchaseOrder', 'role', 'location', 'timestamp', 'hash', 'time'])"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId && (!data.exists() || (!newData.child('role').exists() || newData.child('role').val() === data.child('role').val()))"
      }
    }
  }
}
EOF

echo "✅ Created secure rules in database.rules.json"
echo ""

# Deploy rules
echo "📤 Deploying to Firebase..."
firebase deploy --only database

echo ""
echo "✅ Secure Firebase rules deployed successfully!"
echo ""
echo "🔒 Your database now requires authentication."
echo ""
echo "Next steps:"
echo "  1. Implement authentication (see AUTHENTICATION_IMPLEMENTATION_GUIDE.md)"
echo "  2. Or run ./open-firebase-rules.sh for more testing"
echo ""
echo "Current rules:"
echo "  - ✅ Reads require authentication"
echo "  - ✅ Writes require authentication + role verification"
echo "  - ✅ Users can only access their own data"
echo "  - ✅ Transactions are immutable (cannot update/delete)"
echo ""
