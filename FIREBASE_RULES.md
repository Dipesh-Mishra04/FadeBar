# Firestore Security Rules - Production Guide

Copy and paste these rules into your Firebase Console:
**Firebase Console → Firestore Database → Rules**

## ⚠️ Important: Update These Rules Before Production!

### Option 1: Simple Rules (Current - For Testing)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /queue/{docId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['name', 'phone', 'timestamp', 'status'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() >= 2
                    && request.resource.data.name.size() <= 50
                    && request.resource.data.phone is string
                    && request.resource.data.phone.size() >= 10
                    && request.resource.data.phone.size() <= 15
                    && request.resource.data.status == "waiting";
      allow delete: if true; // Only for testing!
    }
  }
}
```

### Option 2: Production Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Queue collection - public read, authenticated write
    match /queue/{docId} {
      
      // Anyone can read the queue (required for live updates)
      allow read: if true;
      
      // Only create new entries (no update, delete from client)
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll(['name', 'phone', 'timestamp', 'status'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() >= 2
                    && request.resource.data.name.size() <= 50
                    && request.resource.data.name.matches('^[a-zA-Z][a-zA-Z0-9 ]*$')
                    && request.resource.data.phone is string
                    && request.resource.data.phone.matches('^[+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$')
                    && request.resource.data.phone.size() >= 10
                    && request.resource.data.phone.size() <= 15
                    && request.resource.data.status == "waiting";
      
      // DELETE is disabled from client-side
      // Use Firebase Admin SDK or Cloud Functions for deletions
      allow delete: if false;
    }
  }
}
```

## 🚨 Security Recommendations

### 1. Enable Firebase App Check
1. Go to Firebase Console → Project Settings → App Check
2. Register your site with reCAPTCHA v3
3. This prevents unauthorized access from non-approved domains

### 2. Restrict API Keys (Google Cloud Console)
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit your API key
3. Set restrictions:
   - **API restrictions**: Only enable "Cloud Firestore API"
   - **Application restrictions**: Set to your website domain

### 3. Use Cloud Functions for Admin Operations
Instead of allowing client-side delete, create a Cloud Function:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.markCustomerServed = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!context.auth || data.adminPassword !== 'YOUR_ADMIN_PASSWORD') {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  
  const { customerId } = data;
  await admin.firestore().collection('queue').doc(customerId).delete();
  
  return { success: true };
});
```

### 4. Rate Limiting
To prevent spam, add this to your rules:

```javascript
// Add to create rule:
&& request.time戳 - resource.createdAt.timestamp() > 300000  // 5 min cooldown
&& get(/databases/$(database)/documents/queue).size() < 50    // Max 50 in queue
```

## 📋 Quick Checklist Before Going Live

- [ ] Update admin password in `admin.html` (change `FADE2024`)
- [ ] Copy Firestore rules to Firebase Console
- [ ] Enable App Check for your domain
- [ ] Restrict API keys in Google Cloud Console
- [ ] Test from incognito window
- [ ] Test offline functionality

---

**Default Admin Password: `FADE2024`**
Change this in `admin.html` line ~322: `const ADMIN_PASSWORD = "FADE2024";`

