// ============================================================
//  config.example.js — Firebase Configuration Template
//  FADE Barbershop Virtual Queue System
// ============================================================
//
//  INSTRUCTIONS:
//  1. Copy this file and rename to 'config.js'
//  2. Fill in your Firebase project credentials
//  3. Add config.js to .gitignore
// ============================================================

// ⚙️ PASTE YOUR FIREBASE CONFIG HERE ↓↓↓
const firebaseConfig = {
apiKey: "AIzaSyCIGGJuRWW-PgZeyqRmUGwnPDtkCmh9z5Y",
  authDomain: "fade-1024.firebaseapp.com",
  projectId: "fade-1024",
  storageBucket: "fade-1024.firebasestorage.app",
  messagingSenderId: "1002740268293",
  appId: "1:1002740268293:web:5d91356af0edf9bb220b6c",
  measurementId: "G-Y1W0GJDG8P"
};

// Admin password for dashboard (CHANGE THIS!)
const ADMIN_PASSWORD = "FADE2026";

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;

