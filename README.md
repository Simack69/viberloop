# Viberloop Bio - Textile Supply Chain dApp

A decentralized textile supply chain tracking application for iPhone, powered by Firebase.

## 📱 Features

### Field App (`viberloop.html`)
- **Role-based Authentication**: Recycler, Hub Mixed, Spinner, Weaver, Factory, Retailer
- **Dynamic Forms**: Context-aware labels based on user role
- **Photo Compression**: Automatic image compression to <20kb for mobile
- **Blockchain Simulation**: Mock Solana transaction mining
- **Bale Consolidation**: Hub Mixed role can merge multiple bales
- **Real-time Sync**: All transactions sync to Firebase Realtime Database

### Dashboard (`dashboard.html`)
- **Live Ledger**: Searchable transaction table with filters
- **Traceability Map**: Visual supply chain flow with active node indicators
- **Block Explorer**: Solana-style transaction details viewer
- **Digital Passport**: Complete product history with photo evidence
- **Statistics**: Real-time metrics and database usage monitoring

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **Firebase Account** - [Sign up free](https://firebase.google.com/)
3. **Firebase CLI** - Install globally:
   ```bash
   npm install -g firebase-tools
   ```

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `viberloop-bio` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click **"Create Project"**

### Step 2: Enable Firebase Services

#### Enable Realtime Database
1. In Firebase Console, go to **Build → Realtime Database**
2. Click **"Create Database"**
3. Choose location (e.g., `us-central1`)
4. Start in **"Test Mode"** (we'll apply custom rules later)
5. Click **"Enable"**

#### Enable Firebase Hosting
1. Go to **Build → Hosting**
2. Click **"Get Started"**
3. Follow the setup wizard (we'll configure via CLI)

### Step 3: Get Firebase Configuration

1. In Firebase Console, click the **⚙️ gear icon** → **Project Settings**
2. Scroll down to **"Your apps"**
3. Click **"Web"** icon (`</>`)
4. Register app name: `Viberloop Bio`
5. **DO NOT** enable Firebase Hosting here (already done)
6. Copy the `firebaseConfig` object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "viberloop-bio.firebaseapp.com",
  databaseURL: "https://viberloop-bio-default-rtdb.firebaseio.com",
  projectId: "viberloop-bio",
  storageBucket: "viberloop-bio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 4: Configure the App

Firebase credentials are stored in a **gitignored** file `firebase-config.js` to keep them out of the public repository.

1. Copy the example template:
   ```bash
   cp firebase-config.example.js firebase-config.js
   ```
2. Open `firebase-config.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "viberloop-bio.firebaseapp.com",
    databaseURL: "https://viberloop-bio-default-rtdb.firebaseio.com",
    projectId: "viberloop-bio",
    storageBucket: "viberloop-bio.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

> **Important:** `firebase-config.js` is listed in `.gitignore` and must never be committed to git.
> All HTML files load this config automatically via `<script src="firebase-config.js"></script>`.
> When deploying with `firebase deploy`, this file is included in the deployment but stays out of version control.

### Step 5: Deploy to Firebase

1. **Login to Firebase CLI**:
   ```bash
   firebase login
   ```
   This will open your browser for authentication.

2. **Initialize Firebase in your project**:
   ```bash
   cd /path/to/viberloop
   firebase init
   ```

   When prompted:
   - **Which Firebase features?** Select:
     - ✅ Realtime Database
     - ✅ Hosting
   - **Use existing project?** YES
   - **Select your project**: Choose `viberloop-bio` (your project name)
   - **Database rules file**: `database.rules.json` (already created)
   - **Public directory**: `.` (current directory)
   - **Configure as single-page app?** NO
   - **Set up automatic builds?** NO
   - **Overwrite files?** NO (important!)

3. **Deploy the app**:
   ```bash
   firebase deploy
   ```

   This will deploy:
   - ✅ Database rules
   - ✅ Hosting files (viberloop.html, dashboard.html)

4. **Get your live URLs**:
   After deployment completes, you'll see:
   ```
   ✔  Deploy complete!

   Hosting URL: https://viberloop-bio.web.app
   ```

## 📲 iPhone Setup

### Add to Home Screen

1. **Open Safari** on your iPhone
2. Navigate to your Firebase Hosting URL: `https://viberloop-bio.web.app`
3. Tap the **Share** button (square with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it: `Viberloop`
6. Tap **"Add"**

The app will now appear on your home screen like a native app!

### Optimize for iPhone

The app is already optimized with:
- ✅ Responsive design for all iPhone sizes
- ✅ Touch-optimized buttons and inputs
- ✅ Viewport settings for full-screen experience
- ✅ Apple web app meta tags for native feel
- ✅ Camera integration for photo capture

## 🎯 How to Use

### Field App Workflow

1. **Login**:
   - Open the app
   - Select your role (Recycler, Hub Mixed, etc.)

2. **Create Transaction**:
   - Fill in the dynamic form fields
   - Take optional photo (auto-compressed)
   - Submit to chain (simulates blockchain mining)

3. **Hub Mixed Special Feature**:
   - Can consolidate multiple existing bales
   - Select bales from the list before submitting

### Dashboard Workflow

1. **Ledger Tab**:
   - View all transactions in table format
   - Search by ID, source, batch, or hash
   - Click 🆔 to view digital passport

2. **Traceability Map**:
   - Visual flow diagram of supply chain
   - Nodes light up when transactions exist
   - Numbers show transaction count per node

3. **Block Explorer**:
   - Search by transaction hash
   - View Solana-style block details
   - See Borsh data structure

## 🔒 Security Rules

The default rules in `database.rules.json` allow public read/write access for testing.

### Production Security (Recommended)

For production, update `database.rules.json`:

```json
{
  "rules": {
    "transactions": {
      ".read": true,
      ".write": "auth != null",
      "$transactionId": {
        ".validate": "newData.hasChildren(['id', 'batchId', 'wasteSource', 'action', 'location', 'time', 'weight', 'material', 'hash', 'photoUrl'])"
      }
    }
  }
}
```

Then add Firebase Authentication:
1. Enable Email/Password or Anonymous Auth in Firebase Console
2. Update the app to require authentication before writing

Redeploy rules:
```bash
firebase deploy --only database
```

## 🏗️ Project Structure

```
viberloop/
├── viberloop.html          # Field App (data entry)
├── dashboard.html          # Dashboard (control tower)
├── firebase.json           # Firebase hosting config
├── database.rules.json     # Realtime Database rules
└── README.md              # This file
```

## 🧪 Testing

### Local Testing

1. **Install Firebase Emulator**:
   ```bash
   firebase init emulators
   ```
   Select: Database, Hosting

2. **Start Emulators**:
   ```bash
   firebase emulators:start
   ```

3. **Access Local App**:
   - Field App: `http://localhost:5000/viberloop.html`
   - Dashboard: `http://localhost:5000/dashboard.html`

### Test Data

Create test transactions with different roles:
- **Recycler**: NX-12345, Jayanti Group, 200kg
- **Spinner**: PL-SP001, Recycler Hub, 180kg
- **Weaver**: PL-WV001, Spinner Mill, 150kg

## 📊 Database Structure

Firebase Realtime Database schema:

```json
{
  "transactions": {
    "push-id-12345": {
      "id": "NX-12345",
      "batchId": "TRK-A1B2",
      "wasteSource": "Jayanti Group",
      "action": "Bale Creation",
      "location": "RECYCLER HUB",
      "time": "1/18/2026, 10:30 AM",
      "weight": "200 kg",
      "material": "Bio Cotton",
      "hash": "SOL-abc123def456",
      "photoUrl": "data:image/jpeg;base64,...",
      "consolidatedBales": null,
      "timestamp": 1737197400000
    }
  }
}
```

## 🔄 Updates & Redeployment

After making code changes:

1. **Test Locally**:
   ```bash
   firebase serve
   ```

2. **Deploy Updates**:
   ```bash
   firebase deploy
   ```

3. **Deploy Only Hosting** (faster):
   ```bash
   firebase deploy --only hosting
   ```

## 🐛 Troubleshooting

### "Firebase not initialized" Error
- ✅ Check that you replaced ALL placeholder values in `firebaseConfig`
- ✅ Ensure `databaseURL` matches your project region
- ✅ Verify Firebase project is active in console

### No Transactions Appearing
- ✅ Check Firebase Console → Realtime Database for data
- ✅ Verify database rules allow read access
- ✅ Check browser console for errors (F12)

### Photos Not Uploading
- ✅ Ensure camera permission granted on iPhone
- ✅ Check photo file size (should auto-compress)
- ✅ Try with smaller test image first

### Can't Deploy
- ✅ Run `firebase login` again
- ✅ Verify you have Owner/Editor role on Firebase project
- ✅ Check internet connection

## 📈 Scaling for Production

### Performance Optimization
1. **Enable Firebase Indexes**: For faster queries
2. **Add Cloud Functions**: For server-side validation
3. **Implement Pagination**: For large ledgers
4. **Use Firebase Storage**: For larger images

### Database Indexes

Add to Firebase Console → Database → Rules:
```json
{
  "rules": {
    "transactions": {
      ".indexOn": ["timestamp", "location", "hash"]
    }
  }
}
```

## 💡 Future Enhancements

- [ ] Real Solana blockchain integration
- [ ] QR code scanning for asset IDs
- [ ] Offline mode with sync
- [ ] Multi-language support
- [ ] Export ledger to CSV/PDF
- [ ] Push notifications for new transactions
- [ ] User authentication with roles
- [ ] Advanced analytics dashboard

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Firebase Console for errors
3. Check browser console (F12) for JavaScript errors

## 🎉 Success Checklist

- [ ] Created Firebase project
- [ ] Enabled Realtime Database
- [ ] Configured Firebase in both HTML files
- [ ] Deployed to Firebase Hosting
- [ ] Added to iPhone home screen
- [ ] Created first test transaction
- [ ] Viewed transaction in dashboard

---

**Built with ❤️ for sustainable textile supply chains**
