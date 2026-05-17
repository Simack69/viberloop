# Viberloop Bio - Demo Mockup Instructions

This folder contains **standalone demo versions** that work completely offline without any Firebase configuration.

## 📱 Demo Files

### 1. **demo.html** - Landing Page
- Welcome screen with links to both apps
- Load sample data feature
- Clear all data feature

### 2. **viberloop-standalone.html** - Field App
- Fully functional data entry interface
- Uses browser localStorage (no Firebase needed)
- All features working: roles, forms, photos, transactions

### 3. **dashboard-standalone.html** - Dashboard
- Complete dashboard with all three tabs
- Auto-refreshes every 5 seconds
- Shows real-time data from localStorage

## 🚀 How to Use the Demo

### **Option 1: Download and Open Locally (Easiest)**

1. **Download the files** from GitHub:
   - `demo.html`
   - `viberloop-standalone.html`
   - `dashboard-standalone.html`

2. **Double-click `demo.html`** to open in your browser

3. **Click the buttons** to open Field App or Dashboard

4. **That's it!** No server or configuration needed.

### **Option 2: Use GitHub Pages**

If you enable GitHub Pages for this repository:

1. Go to Repository Settings → Pages
2. Enable Pages from `main` or your branch
3. Access the demo at: `https://Simack69.github.io/viberloop/demo.html`

### **Option 3: View from Raw GitHub URL**

1. Go to the file on GitHub
2. Click "Raw" button
3. Copy the URL
4. Open in your browser

## 🎯 Complete Demo Workflow

### Step 1: Load Sample Data (Optional)

1. Open `demo.html`
2. Click **"Load Sample Data"** button
3. This creates 5 sample transactions across different supply chain nodes

### Step 2: Use the Field App

1. Click **"Open Field App"** button
2. Select a role (e.g., Recycler)
3. Fill out the form:
   - **Reference Code**: NX-10010
   - **Batch/Truck ID**: TRK-A005
   - **Source**: Demo Textile Hub
   - **Weight**: 250
   - **Material**: Bio Cotton
4. (Optional) Upload a photo
5. Click **"Submit to Chain"**
6. Watch the mining animation
7. See your transaction in the recent list

### Step 3: View in Dashboard

1. Click **"Open Dashboard"** button (or use the link in Field App)
2. See your new transaction in the **Ledger** tab
3. Click **Traceability Map** tab:
   - Nodes light up purple when they have transactions
   - Numbers show transaction count
4. Click **Block Explorer** tab:
   - Copy a transaction hash from the ledger
   - Paste it in the search box
   - See detailed blockchain-style information
5. Click the 🆔 button on any transaction to view **Digital Passport**

### Step 4: Test Multiple Roles

1. Go back to Field App
2. Logout (top right button)
3. Login as a different role (e.g., Spinner)
4. Notice the form changes:
   - "NX Reference Code" becomes "Packing List Number"
   - Different location displayed
5. Create another transaction
6. Check dashboard - now multiple nodes light up!

### Step 5: Test Hub Mixed Consolidation

1. Login as **Hub Mixed**
2. Notice the new "Consolidate Existing Bales" section
3. Select multiple existing bales (checkboxes)
4. Create a new consolidated bale
5. View in dashboard

## 🔄 Data Persistence

- All data is stored in **browser localStorage**
- Data persists even after closing the browser
- Data is **specific to your browser** (not shared between browsers)
- To clear data: Click "Clear All Data" button on demo.html

## 📊 What You Can Test

### Field App Features
✅ Role-based login (6 different roles)
✅ Dynamic form labels based on role
✅ Photo upload and compression
✅ Blockchain mining simulation
✅ Recent transactions list
✅ Bale consolidation (Hub Mixed only)

### Dashboard Features
✅ Live ledger table
✅ Search and filter transactions
✅ Traceability map with animated nodes
✅ Block explorer with hash search
✅ Digital passport modal
✅ Real-time statistics
✅ Auto-refresh every 5 seconds

## 🎨 Design Elements to Notice

- **Purple color scheme** throughout
- **Glassmorphism effects** on cards and modals
- **Smooth animations** for mining and loading
- **Responsive design** works on mobile and desktop
- **Green "DEMO MODE" badge** in top right
- **Touch-optimized** buttons and inputs

## 📱 Testing on iPhone

1. Download `viberloop-standalone.html` to your iPhone
2. Open in Safari
3. Tap the **Share** button
4. Select **"Add to Home Screen"**
5. The app will install like a native app!
6. Repeat for `dashboard-standalone.html`

## 🆚 Demo vs Production Versions

| Feature | Demo (Standalone) | Production (Firebase) |
|---------|------------------|---------------------|
| Configuration | None needed | Requires Firebase setup |
| Data Storage | localStorage | Firebase Realtime Database |
| Data Sharing | Browser-only | Shared across all users |
| Offline Mode | Always works | Requires initial Firebase load |
| Best For | Testing/Preview | Production deployment |

## 🔧 Troubleshooting

### "Transactions not showing in dashboard"
- Make sure you're using the **standalone** versions
- Check that both apps are from the same domain/folder
- Try clicking the refresh button on dashboard

### "Photo not uploading"
- Browser may block file access for local files
- Try hosting on GitHub Pages or a local server
- Use the production version for full photo support

### "Data disappeared"
- Check if you cleared browser data/cookies
- localStorage is browser-specific (Chrome vs Safari have separate storage)
- Use demo.html to reload sample data

## 💡 Tips

- Open Field App and Dashboard in **separate browser tabs** to see real-time updates
- The dashboard auto-refreshes every 5 seconds
- Use different roles to see the complete supply chain flow
- Try searching in the ledger by ID, source, or batch number
- Click on nodes in the traceability map (future feature: filter by node)

## 🎉 Have Fun!

This demo shows the complete Viberloop Bio dApp experience. For production use:
1. Follow the main README.md
2. Configure Firebase
3. Deploy using `firebase deploy`

---

**Questions?** Check the main [README.md](README.md) for full documentation.
