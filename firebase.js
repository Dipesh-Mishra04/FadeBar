// ============================================================
//  firebase.js — Firebase Web SDK v9 (Modular) Configuration
//  FADE Barbershop Virtual Queue System
// ============================================================
//
//  CONFIGURATION:
//  This file now reads credentials from config.js
//  See config.example.js for setup instructions
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Wait for config.js to load
function getFirebaseConfig() {
  if (window.firebaseConfig) {
    return window.firebaseConfig;
  }
  // Fallback: throw error if config not loaded
  throw new Error("Firebase config not found. Please ensure config.js is loaded before firebase.js");
}

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());

// Initialize and export Firestore
export const db = getFirestore(app);

// ============================================================
//  FIRESTORE SECURITY RULES (paste in Firebase Console):
//
//  rules_version = '2';
//  service cloud.firestore {
//    match /databases/{database}/documents {
//      match /queue/{docId} {
//        allow read: if true;
//        allow create: if request.resource.data.name is string
//                      && request.resource.data.phone is string
//                      && request.resource.data.timestamp != null;
//        allow delete: if true; // Tighten this for production
//      }
//    }
//  }
// ============================================================




