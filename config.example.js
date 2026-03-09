// ============================================================
//  config.example.js — Firebase Configuration Template
//  FADE Barbershop Virtual Queue System
// ============================================================
//
//  INSTRUCTIONS:
//  1. Copy this file and rename to 'config.js'
//  2. Fill in your Firebase project credentials from Firebase Console
//  3. Add config.js to .gitignore (already done)
// ============================================================

// ⚙️ PASTE YOUR FIREBASE CONFIG HERE ↓↓↓
// Replace all the XXXXXXX values with your actual Firebase project values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Admin password for dashboard (CHANGE THIS!)
const ADMIN_PASSWORD = "FADE2026";

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;

