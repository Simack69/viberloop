# Multi-Photo & File Upload Guide

## 📸 Overview

Both V1 and V2 now support **multiple photos and file attachments** for each transaction.

---

## ✨ Features

### Photos
- **Multiple photos per transaction** (up to 10)
- Take photos with camera OR upload from gallery
- Automatic image compression (max 500KB per photo)
- Photo gallery preview with thumbnails
- Individual photo removal
- Firebase Storage integration

### Files
- **Multiple file attachments** (up to 5)
- Supported formats: PDF, DOC, DOCX, TXT, CSV
- Max file size: 5MB per file
- File list with icons and size display
- Individual file removal

---

## 🎯 User Interface

### Upload Options

1. **Take Photos** - Use device camera
2. **Upload Photos** - Choose from gallery
3. **Attach Files** - Upload documents

### Visual Indicators

- **Upload counter**: Shows "X photos, Y files"
- **Photo gallery**: 3-column grid with thumbnails
- **File list**: Shows filename, type, and size
- **Remove buttons**: Hover to see delete option

---

## 💾 Storage Strategy

### Hybrid Approach: Firebase + Blockchain

```
┌─────────────────────────────────────────┐
│  STORAGE ARCHITECTURE                   │
├─────────────────────────────────────────┤
│                                         │
│  1. Photos/Files                        │
│     ↓                                   │
│  Firebase Storage                       │
│     • Actual file data                  │
│     • Fast CDN delivery                 │
│     • Cost-effective                    │
│                                         │
│  2. URLs + Metadata                     │
│     ↓                                   │
│  Firebase Database                      │
│     • Download URLs                     │
│     • File metadata                     │
│     • Transaction data                  │
│                                         │
│  3. URLs/Hashes (Future)                │
│     ↓                                   │
│  Solana Blockchain (V2)                 │
│     • Immutable proof                   │
│     • Transaction signatures            │
│     • Tamper-proof record               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📁 Firebase Storage Structure

```
/transactions/
  ├── {transaction-hash}/
  │   ├── photos/
  │   │   ├── photo-1-1234567890.jpg
  │   │   ├── photo-2-1234567890.jpg
  │   │   └── photo-3-1234567890.jpg
  │   └── files/
  │       ├── certificate.pdf
  │       ├── invoice.pdf
  │       └── packing-list.csv
```

---

## 🗄️ Database Schema

### Transaction Object

```json
{
  "hash": "SOL-abc123xyz789",
  "customer": "EkoPlaza",
  "purchaseOrder": "PO-2024-001",
  "timestamp": 1234567890000,

  "photos": [
    {
      "url": "https://firebasestorage.googleapis.com/.../photo-1.jpg",
      "filename": "photo-1-1234567890.jpg",
      "uploadedAt": 1234567890000
    },
    {
      "url": "https://firebasestorage.googleapis.com/.../photo-2.jpg",
      "filename": "photo-2-1234567890.jpg",
      "uploadedAt": 1234567891000
    }
  ],

  "files": [
    {
      "url": "https://firebasestorage.googleapis.com/.../cert.pdf",
      "name": "certificate.pdf",
      "type": "application/pdf",
      "size": 102400,
      "uploadedAt": 1234567892000
    }
  ],

  "photoCount": 2,
  "fileCount": 1,

  "...": "other transaction fields"
}
```

---

## 🔄 Upload Process

### Step-by-Step Flow

```
1. User selects photos/files
   ↓
2. Photos compressed to max 500KB
   ↓
3. Preview shown in UI
   ↓
4. User submits transaction
   ↓
5. Photos/files uploaded to Firebase Storage
   ↓
6. Download URLs retrieved
   ↓
7. Transaction saved to Firebase Database
   ↓
8. [V2] URLs will be included in Solana transaction
```

---

## 🚀 Future Solana Integration (V2)

### When Solana backend is integrated:

```javascript
// Solana transaction will include:
{
  "type": "SUPPLY_CHAIN_EVENT",
  "txHash": "SOL-abc123xyz789",
  "photos": [
    "https://firebasestorage.googleapis.com/.../photo-1.jpg",
    "https://firebasestorage.googleapis.com/.../photo-2.jpg"
  ],
  "files": [
    "https://firebasestorage.googleapis.com/.../cert.pdf"
  ],
  "timestamp": 1234567890000,
  "metadata": { /* transaction data */ }
}
```

### Benefits:

✅ **Immutable proof** - Blockchain record can't be altered
✅ **Timestamp verification** - Exact time recorded on-chain
✅ **File integrity** - URLs stored on blockchain
✅ **Audit trail** - Complete transaction history
✅ **Fast access** - Files served from Firebase CDN
✅ **Cost-effective** - Only URLs on blockchain (not file data)

---

## 📊 Limits & Constraints

| Feature | Limit | Reason |
|---------|-------|--------|
| Photos per transaction | 10 | UI/UX balance |
| Files per transaction | 5 | Prevent abuse |
| Photo size after compression | 500KB | Upload speed |
| File size | 5MB | Firebase quotas |
| Supported file types | PDF, DOC, DOCX, TXT, CSV | Common formats |

---

## 🔧 Technical Implementation

### Key Functions

#### V1 & V2

```javascript
// Handle file uploads (photos or files)
handleFileUpload(event, type)

// Compress and add photo
compressAndAddPhoto(file, dataUrl)

// Render photo gallery
renderPhotoGallery()

// Render file list
renderFileList()

// Update upload counter
updateUploadCount()

// Remove individual photo
removePhoto(index)

// Remove individual file
removeFile(index)

// Clear all photos and files
clearAllFiles()
```

---

## 🎨 UI Components

### Photo Gallery

```html
<div id="photoGallery" class="grid grid-cols-3 gap-2">
  <!-- 3-column grid of thumbnails -->
  <!-- Hover to reveal delete button -->
  <!-- Green checkmark when uploaded -->
</div>
```

### File List

```html
<div id="fileList" class="space-y-2">
  <!-- List of files with icons -->
  <!-- Shows filename, size, type -->
  <!-- Delete button on the right -->
</div>
```

---

## 🔐 Security Considerations

1. **File Size Validation** - Prevent large uploads
2. **File Type Validation** - Only allowed extensions
3. **Firebase Security Rules** - Protect storage buckets
4. **Unique Paths** - Transaction hash prevents collisions
5. **Client-side Compression** - Reduce bandwidth usage

---

## 💡 Best Practices

### For Users

1. **Take clear photos** - Good lighting, stable camera
2. **Relevant files only** - Don't upload unnecessary documents
3. **Check before submit** - Review gallery/file list
4. **Name files clearly** - Easy to identify later

### For Developers

1. **Monitor storage usage** - Firebase has quotas
2. **Implement cleanup** - Delete orphaned files
3. **Add retry logic** - Handle upload failures
4. **Compress aggressively** - Balance quality vs size
5. **Test offline mode** - Queue uploads for later

---

## 📈 Future Enhancements

### Potential Features

- [ ] IPFS integration (decentralized storage)
- [ ] Image metadata extraction (GPS, timestamp)
- [ ] Multiple photo sizes (thumbnail, medium, full)
- [ ] Video support
- [ ] Offline upload queue
- [ ] Progress bars for large uploads
- [ ] Bulk photo download
- [ ] Photo annotations/markup
- [ ] OCR for document text extraction
- [ ] Duplicate detection

---

## 🐛 Troubleshooting

### Common Issues

**Photos not uploading?**
- Check Firebase Storage is initialized
- Verify storage rules allow writes
- Check network connection
- Ensure file size is under limit

**Files not showing?**
- Check file extension is allowed
- Verify file size is under 5MB
- Check browser console for errors

**Upload taking too long?**
- Compress photos more aggressively
- Reduce number of photos
- Check network speed
- Use faster WiFi connection

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Review Firebase logs
- Test with smaller files first
- Ensure Firebase config is correct

---

**Last Updated**: 2026-03-13
**Version**: 1.0.0 (Multi-photo feature)
