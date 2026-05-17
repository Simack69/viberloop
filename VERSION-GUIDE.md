# 📦 Viberloop Version Guide

This document explains the version structure of the Viberloop Bio dApp.

---

## 🗂️ Directory Structure

```
viberloop/
├── v1/                          # Version 1.0 - Stable (No Blockchain)
│   ├── index.html              # Main Firebase version
│   ├── standalone.html         # Standalone localStorage version
│   └── firebase-config.example.js
│
├── v2/                          # Version 2.0 - Solana Integration (In Development)
│   ├── index.html              # Firebase + Solana version
│   ├── standalone.html         # Standalone with Solana
│   ├── firebase-config.example.js
│   └── server/                 # Backend API (to be created)
│       ├── index.js
│       ├── config/
│       ├── routes/
│       └── services/
│
├── css/                         # Shared CSS (used by both versions)
├── src/                         # Shared source files
├── index.html                   # Version selector page
└── VERSION-GUIDE.md            # This file
```

---

## 📌 Version Differences

### **V1 - Stable Release (Current)**
**Tag:** `v1.0.0`
**Status:** ✅ Production Ready
**Location:** `/v1/`

**Features:**
- ✅ Firebase authentication
- ✅ Multi-location field tracking (Farm → Spinner → Weaver → Manufacturing → PoL)
- ✅ Incoming/Outgoing transaction tabs
- ✅ Form validation and data capture
- ✅ Success animations
- ✅ Safari iOS optimizations
- ✅ Glassmorphism UI
- ❌ **No blockchain integration**

**Data Storage:** Firebase Firestore only

**Use Case:**
- Production deployments
- Client demos
- Stable reference implementation

**Access:**
- **Firebase version:** `https://your-domain.com/v1/index.html`
- **Standalone version:** `https://your-domain.com/v1/standalone.html`

---

### **V2 - Solana Integration (In Development)**
**Tag:** Not tagged yet
**Status:** 🚧 Under Development
**Location:** `/v2/`

**Features:**
- ✅ All V1 features
- 🚧 Server-side Solana wallet
- 🚧 Transaction signing & blockchain registration
- 🚧 Backend API (Node.js + Express)
- 🚧 Solana Testnet integration
- 🚧 Transaction status monitoring
- 🚧 Blockchain explorer links

**Data Storage:**
- Firebase Firestore (user data, form data)
- Solana Blockchain (transaction signatures, immutable records)

**Use Case:**
- Development and testing
- Blockchain proof-of-concept
- Experimental features

**Access:**
- **Firebase version:** `https://your-domain.com/v2/index.html`
- **Standalone version:** `https://your-domain.com/v2/standalone.html`

---

## 🔄 Version Control Strategy

### **Git Tags**
```bash
# View all tags
git tag -l

# Checkout specific version
git checkout v1.0.0

# Return to latest
git checkout claude/viberloop-bio-dapp-ios-671QR
```

### **Development Workflow**

1. **Working on V1 (Stable):**
   ```bash
   cd v1/
   # Make changes
   # Test thoroughly
   # Commit with prefix: [V1] Fix: ...
   ```

2. **Working on V2 (Solana):**
   ```bash
   cd v2/
   # Make changes
   # Test on Solana testnet
   # Commit with prefix: [V2] Add: ...
   ```

3. **Shared Resources (CSS, etc.):**
   ```bash
   # Update in root
   npm run build:css
   # Both v1/ and v2/ use /css/tailwind.css
   ```

---

## 🚀 Deployment Guide

### **Deploy Both Versions**

**Option 1: Same Server, Different Paths**
```nginx
# Nginx config example
location /v1/ {
    alias /var/www/viberloop/v1/;
    index index.html;
}

location /v2/ {
    alias /var/www/viberloop/v2/;
    index index.html;
}

# V2 backend API
location /api/ {
    proxy_pass http://localhost:3000;
}
```

**Option 2: Subdomain**
```
v1.viberloop.app → Points to /v1/
v2.viberloop.app → Points to /v2/
api.viberloop.app → Backend server
```

**Option 3: Query Parameter**
```
viberloop.app?version=1 → Loads v1
viberloop.app?version=2 → Loads v2
```

---

## 🔧 Configuration

### **V1 Setup**
```bash
cd v1/
cp firebase-config.example.js firebase-config.js
# Edit firebase-config.js with your Firebase credentials
```

### **V2 Setup**
```bash
cd v2/
cp firebase-config.example.js firebase-config.js
# Edit firebase-config.js

# Backend setup
cd server/
npm install
cp .env.example .env
# Edit .env with Solana wallet & Firebase credentials
npm start
```

---

## 📊 Feature Comparison Matrix

| Feature | V1 (Stable) | V2 (Solana) |
|---------|-------------|-------------|
| Firebase Auth | ✅ | ✅ |
| Multi-location Tracking | ✅ | ✅ |
| Form Validation | ✅ | ✅ |
| Safari iOS Support | ✅ | ✅ |
| Data Persistence | Firebase | Firebase + Blockchain |
| Transaction Immutability | ❌ | ✅ |
| Blockchain Explorer | ❌ | ✅ |
| Audit Trail | Limited | Full |
| Backend API | ❌ | ✅ |
| Server-side Wallet | ❌ | ✅ |
| Transaction Signatures | ❌ | ✅ |

---

## 🎯 When to Use Each Version

### **Use V1 when:**
- ✅ You need a proven, stable application
- ✅ Blockchain is not required
- ✅ Faster deployment is needed
- ✅ Lower infrastructure costs
- ✅ Demonstrating core functionality

### **Use V2 when:**
- ✅ Blockchain immutability is required
- ✅ Audit trails must be tamper-proof
- ✅ Integration with Solana ecosystem
- ✅ Testing blockchain features
- ✅ Future-proofing the application

---

## 🔒 Security Notes

### **V1:**
- Firebase security rules control access
- No private keys to manage
- Simpler attack surface

### **V2:**
- Server-side private key must be secured
- API authentication required
- Rate limiting needed
- HTTPS mandatory
- Environment variables for secrets

---

## 📝 Version History

### **v1.0.0** (2026-03-06)
- Initial stable release
- Firebase authentication
- Multi-location field tracking
- iOS Safari optimizations
- No blockchain integration

### **v2.0.0** (In Development)
- Solana testnet integration
- Server-side wallet
- Backend API
- Transaction registration on blockchain

---

## 🆘 Support & Questions

**Choose the right version:**
- Not sure? Start with **V1** (stable, proven)
- Need blockchain? Use **V2** (experimental)

**Migration:**
- Data from V1 can be migrated to V2
- V2 is backward compatible with V1 data structure

---

## 📋 Next Steps for V2

1. ✅ Directory structure created
2. 🚧 Backend server implementation
3. 🚧 Solana wallet setup
4. 🚧 API endpoints creation
5. 🚧 Frontend integration with API
6. 🚧 Testing on Solana testnet
7. 🚧 Security audit
8. 🚧 Documentation update

---

**Last Updated:** 2026-03-06
**Maintained By:** Claude Code
**Session:** https://claude.ai/code/session_01XktPR9tw18QWcowBNZVmpG
