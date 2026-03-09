# FADE Barbershop - Virtual Queue System

A modern, real-time virtual queue management system for barbershops. Built with Firebase Firestore for live updates and a premium dark/gold UI theme.

![FADE Barbershop](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-10.12.0-orange)

## Features

- **Real-time Queue Updates** - Live position tracking using Firebase Firestore
- **Customer Portal** - Easy join/leave queue functionality
- **Admin Dashboard** - Password-protected management panel
- **Premium UI** - Dark theme with gold accents
- **Offline Support** - Handles connection issues gracefully
- **Mobile Responsive** - Works on all devices

## Quick Start

### Prerequisites

- Node.js 18+ (optional, for deployment)
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd barbershopproject
   ```

2. **Configure Firebase**
   ```bash
   cp config.example.js config.js
   ```
   
   Edit `config.js` with your Firebase credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... other credentials
   };
   
   const ADMIN_PASSWORD = "YOUR_SECURE_PASSWORD";
   ```

3. **Set up Firestore**
   
   Copy rules from `FIREBASE_RULES.md` to Firebase Console → Firestore → Rules

4. **Run locally**
   
   Open `index.html` in a browser (use a local server for best results):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## Usage

### Customer View (`index.html`)

1. Enter your name and phone number
2. Click "Join Queue"
3. Watch your position update in real-time
4. Get notified when it's your turn

### Admin Dashboard (`admin.html`)

1. Enter the admin password (default: `FADE2026`)
2. View current queue and stats
3. Mark customers as served
4. Adjust estimated wait times

## Project Structure

```
├── index.html           # Customer-facing queue interface
├── admin.html           # Admin dashboard
├── app.js               # Customer-side logic
├── firebase.js          # Firebase configuration
├── style.css            # CSS styles
├── config.js            # Credentials (DO NOT COMMIT)
├── config.example.js    # Config template
├── .gitignore           # Git ignore rules
├── FIREBASE_RULES.md    # Firestore security rules
└── README.md            # This file
```

## Security

⚠️ **Important:**

- `config.js` contains sensitive credentials and is in `.gitignore`
- Always use a strong admin password
- Enable Firebase App Check for production
- Review Firestore rules in Firebase Console
- Restrict API keys in Google Cloud Console

## Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

### Vercel
```bash
vercel --prod
```

### Netlify
Drag and drop the project folder to Netlify dashboard

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Firebase Firestore
- **CDN:** Bootstrap 5, Google Fonts
- **Fonts:** Playfair Display, DM Sans, DM Mono

## License

MIT License - Feel free to use this project for your barbershop!

---

Made ✂ with by FADE Barbershop

