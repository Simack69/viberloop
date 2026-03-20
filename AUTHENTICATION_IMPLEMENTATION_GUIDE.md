# 🔐 Authentication Implementation Guide
**Viberloop Bio - Adding Firebase Authentication**

---

## 📋 Overview

This guide walks you through implementing Firebase Authentication with role-based access control (RBAC) in Viberloop Bio.

**Time Required:** 2-3 hours
**Difficulty:** Medium
**Impact:** **CRITICAL** - Fixes the #1 security vulnerability

---

## 🎯 What This Fixes

✅ Implements proper email/password authentication
✅ Role-based access control (RBAC)
✅ Secure Firebase Database/Firestore rules
✅ User registration with admin approval
✅ Password reset functionality
✅ Session management
✅ Audit trail (who did what)

---

## 📦 Files Created

| File | Purpose |
|------|---------|
| `v1/auth.js` | Authentication module |
| `firestore.rules` | Firestore security rules |
| `database.rules.json` | Realtime Database security rules |
| This guide | Step-by-step implementation |

---

## 🚀 Implementation Steps

### **Step 1: Enable Firebase Authentication**

1. **Go to Firebase Console:**
   https://console.firebase.google.com/

2. **Select your project:** `viberloop-bio`

3. **Navigate to:** Authentication → Sign-in method

4. **Enable Email/Password:**
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

### **Step 2: Enable Firestore** (if not already enabled)

1. **Navigate to:** Firestore Database

2. **Click:** "Create database"

3. **Select:** Start in **production mode**

4. **Choose location:** `us-central` (or nearest to users)

### **Step 3: Deploy Security Rules**

#### **Firestore Rules:**
```bash
cd /path/to/viberloop
firebase deploy --only firestore:rules
```

#### **Realtime Database Rules:**
```bash
firebase deploy --only database
```

###**Step 4: Update V1 HTML**

Add the authentication module to `v1/index.html`:

```html
<!-- Add after Firebase SDKs, before closing </head> -->
<script src="/v1/auth.js"></script>
```

The Firebase Auth and Firestore SDKs have already been added!

### **Step 5: Update Login Screen**

Replace the role selection buttons in `v1/index.html` with a proper login form.

**Find this code** (around line 97-137):
```html
<div class="space-y-3">
    <button onclick="login('WASTE_SOURCE')" class="...">
        <span><i class="fas fa-warehouse mr-3"></i>Waste Source</span>
        <i class="fas fa-arrow-right"></i>
    </button>
    <!-- ... more buttons ... -->
</div>
```

**Replace with:**
```html
<form id="loginForm" class="space-y-4" onsubmit="handleLogin(event)">
    <!-- Role Selection -->
    <div>
        <label class="block text-white text-sm font-bold mb-2">
            Select Your Role
        </label>
        <select id="loginRole" required
                class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Choose role...</option>
            <option value="WASTE_SOURCE">Waste Source</option>
            <option value="RECYCLING_HUB">Recycling Hub</option>
            <option value="SPINNER">Spinner</option>
            <option value="WEAVER">Weaver</option>
            <option value="MANUFACTURING">Manufacturing</option>
            <option value="POL">Point of Loading</option>
            <option value="POD">Point of Destination</option>
            <option value="DISTRIBUTION_CENTER">Distribution Center</option>
        </select>
    </div>

    <!-- Email -->
    <div>
        <label class="block text-white text-sm font-bold mb-2">
            Email Address
        </label>
        <input type="email" id="loginEmail" required
               class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
               placeholder="your.email@company.com">
    </div>

    <!-- Password -->
    <div>
        <label class="block text-white text-sm font-bold mb-2">
            Password
        </label>
        <input type="password" id="loginPassword" required
               class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
               placeholder="••••••••">
    </div>

    <!-- Submit Button -->
    <button type="submit"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition">
        <i class="fas fa-sign-in-alt mr-2"></i>
        Sign In
    </button>

    <!-- Loading State -->
    <div id="authLoading" class="hidden text-center text-white text-sm py-2">
        <i class="fas fa-spinner fa-spin mr-2"></i>Loading...
    </div>

    <!-- Forgot Password -->
    <button type="button" onclick="showForgotPassword()"
            class="w-full text-purple-300 hover:text-purple-100 text-sm">
        Forgot Password?
    </button>
</form>
```

### **Step 6: Add Login Handler**

Add this script before the closing `</script>` tag in `v1/index.html`:

```javascript
/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    if (!email || !password || !role) {
        alert('Please fill in all fields');
        return;
    }

    try {
        await signInWithEmailAndPassword(email, password, role);
        // Success! The auth state listener in auth.js will handle the rest
    } catch (error) {
        // Error already handled in auth.js
    }
}

/**
 * Show forgot password dialog
 */
function showForgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        resetPassword(email);
    }
}

/**
 * Updated logout function with authentication
 */
function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        signOut();
    }
}
```

### **Step 7: Protect Transaction Submissions**

**Find** the `confirmSubmission()` function (around line 1024):

```javascript
async function confirmSubmission() {
    if (!pendingFormData) {
        alert('No pending transaction data');
        return;
    }

    // ADD THIS CHECK:
    if (!isAuthenticated()) {
        alert('You must be signed in to submit transactions');
        showLoginScreen();
        return;
    }

    // Rest of the function...
}
```

**Update transaction data** to include user information (around line 1118):

```javascript
const transaction = {
    ...pendingFormData,
    hash: hash,
    time: new Date().toLocaleString(),
    photos: photoUrls,
    files: fileUrls,
    photoCount: photoUrls.length,
    fileCount: fileUrls.length,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    // ADD THESE:
    createdBy: getCurrentUser().uid,
    createdByEmail: getCurrentUser().email
};
```

### **Step 8: Create Admin User Registration Page**

Create `v1/admin-register.html` for creating user accounts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Viberloop Bio - Register Users</title>
    <link rel="stylesheet" href="/css/tailwind.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="/__/firebase/init.js?useService=firestore"></script>
    <script src="/v1/auth.js"></script>
</head>
<body class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen p-8">
    <div class="max-w-2xl mx-auto">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h1 class="text-white text-3xl font-bold mb-6">
                <i class="fas fa-user-plus mr-3"></i>Register New User
            </h1>

            <form id="registerForm" onsubmit="handleRegistration(event)" class="space-y-4">
                <div>
                    <label class="block text-white text-sm font-bold mb-2">Full Name</label>
                    <input type="text" id="regName" required
                           class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white">
                </div>

                <div>
                    <label class="block text-white text-sm font-bold mb-2">Email Address</label>
                    <input type="email" id="regEmail" required
                           class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white">
                </div>

                <div>
                    <label class="block text-white text-sm font-bold mb-2">Password (min 6 characters)</label>
                    <input type="password" id="regPassword" required minlength="6"
                           class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white">
                </div>

                <div>
                    <label class="block text-white text-sm font-bold mb-2">Role</label>
                    <select id="regRole" required
                            class="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white">
                        <option value="">Select role...</option>
                        <option value="WASTE_SOURCE">Waste Source</option>
                        <option value="RECYCLING_HUB">Recycling Hub</option>
                        <option value="SPINNER">Spinner</option>
                        <option value="WEAVER">Weaver</option>
                        <option value="MANUFACTURING">Manufacturing</option>
                        <option value="POL">Point of Loading</option>
                        <option value="POD">Point of Destination</option>
                        <option value="DISTRIBUTION_CENTER">Distribution Center</option>
                    </select>
                </div>

                <button type="submit"
                        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl">
                    <i class="fas fa-user-plus mr-2"></i>Create Account
                </button>

                <div id="authLoading" class="hidden text-center text-white text-sm py-2">
                    <i class="fas fa-spinner fa-spin mr-2"></i>Creating account...
                </div>
            </form>

            <a href="/v1/" class="block text-center text-purple-300 hover:text-purple-100 mt-6">
                <i class="fas fa-arrow-left mr-2"></i>Back to Login
            </a>
        </div>
    </div>

    <script>
        async function handleRegistration(event) {
            event.preventDefault();

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;

            try {
                await registerUser(email, password, role, name);
                document.getElementById('registerForm').reset();
            } catch (error) {
                // Error handled in auth.js
            }
        }
    </script>
</body>
</html>
```

### **Step 9: Test the Authentication System**

#### **9.1. Register First User:**
1. Open: `https://viberloop-bio.firebaseapp.com/v1/admin-register.html`
2. Fill in the form:
   - Name: John Doe
   - Email: john@company.com
   - Password: password123
   - Role: WASTE_SOURCE
3. Click "Create Account"

#### **9.2. Sign In:**
1. Go to: `https://viberloop-bio.firebaseapp.com/v1/`
2. Select Role: WASTE_SOURCE
3. Enter credentials
4. Click "Sign In"

#### **9.3. Submit a Transaction:**
1. Fill out the form
2. Upload photos (optional)
3. Submit
4. ✅ Should work!

#### **9.4. Verify Security:**
1. Open Browser Console (F12)
2. Try: `localStorage.removeItem('viberloop_role')`
3. Refresh page
4. ✅ Should still be logged in (not using localStorage anymore!)

---

## 🔒 Security Rules Verification

### **Test Firestore Rules:**

```javascript
// Open Browser Console
const firestore = firebase.firestore();

// Try to read other user's profile (should FAIL)
firestore.collection('users').doc('OTHER_USER_ID').get()
    .then(() => console.log('❌ SECURITY BREACH!'))
    .catch(() => console.log('✅ Security working!'));

// Try to create transaction with wrong role (should FAIL)
firestore.collection('transactions').add({
    role: 'DIFFERENT_ROLE',  // Not your role
    customer: 'Test'
})
.then(() => console.log('❌ SECURITY BREACH!'))
.catch(() => console.log('✅ Security working!'));
```

---

## 📊 Firebase Console Verification

### **Check Users Created:**
1. Firebase Console → Firestore Database
2. Navigate to: `users` collection
3. ✅ Should see user documents with:
   - email
   - name
   - role
   - status
   - createdAt

### **Check Transactions:**
1. Navigate to: `transactions` collection (Realtime Database)
2. ✅ Should see:
   - createdBy (user UID)
   - createdByEmail
   - All other transaction data

---

## 🔄 Applying to V2

Once V1 is working:

1. **Copy auth.js to V2:**
   ```bash
   cp v1/auth.js v2/auth.js
   ```

2. **Add SDKs to V2 HTML** (already done!)

3. **Update login screen** (same as V1)

4. **Add auth checks** (same as V1)

5. **Test thoroughly**

---

## 🐛 Troubleshooting

### **Problem: "Firebase: Error (auth/operation-not-allowed)"**
**Solution:** Enable Email/Password in Firebase Console → Authentication → Sign-in method

### **Problem: "Missing or insufficient permissions"**
**Solution:** Deploy security rules: `firebase deploy --only firestore:rules database`

### **Problem: "User not found after registration"**
**Solution:** Check Firestore console, ensure user document was created

### **Problem: "Cannot read transactions"**
**Solution:** Ensure user is authenticated: `firebase.auth().currentUser !== null`

---

## ✅ Post-Implementation Checklist

- [ ] Firebase Authentication enabled
- [ ] Firestore enabled
- [ ] Security rules deployed
- [ ] auth.js added to project
- [ ] Login screen updated
- [ ] Test user registered
- [ ] Successful login tested
- [ ] Transaction submission works
- [ ] Security rules verified
- [ ] V2 updated (optional)
- [ ] Deployed to Firebase Hosting

---

## 📈 Next Steps

After authentication is working:

1. **Add XSS Protection** (SECURITY_AUDIT_REPORT.md #2)
2. **Remove eval()** (SECURITY_AUDIT_REPORT.md #3)
3. **Add Input Validation** (SECURITY_AUDIT_REPORT.md #7)
4. **Professional Security Audit** ($5k-$15k)

---

## 💡 Additional Features (Optional)

### **Email Verification:**
```javascript
// After registration:
await user.sendEmailVerification();
```

### **Two-Factor Authentication:**
```javascript
// Enable in Firebase Console
// Use firebase.auth().multiFactor
```

### **Audit Logging:**
```javascript
// Log all important actions
await firestore.collection('audit_logs').add({
    userId: currentUser.uid,
    action: 'TRANSACTION_CREATED',
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    data: { transactionId: '...' }
});
```

---

## 📞 Support

**Issues?**
- Check browser console for errors
- Verify Firebase Console settings
- Review security rules syntax
- Test with different users

**Questions?**
- Review this guide step-by-step
- Check SECURITY_AUDIT_REPORT.md
- Firebase Documentation: https://firebase.google.com/docs/auth

---

## ✨ Summary

You've implemented:
- ✅ **CRITICAL FIX:** Proper authentication
- ✅ Role-based access control
- ✅ Secure database rules
- ✅ User registration system
- ✅ Password management
- ✅ Audit trail

**Time invested:** 2-3 hours
**Security improvement:** 🔴 HIGH RISK → 🟡 MEDIUM RISK

**Well done!** 🎉

---

*Last updated: March 20, 2026*
