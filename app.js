// ============================================================
//  app.js — Customer Queue Logic
//  FADE Barbershop Virtual Queue System
//  Firebase Web SDK v9 (Modular) — No build step needed
// ============================================================

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── DOM References ──────────────────────────────────────────
const joinForm       = document.getElementById("joinForm");
const nameInput      = document.getElementById("customerName");
const phoneInput     = document.getElementById("customerPhone");
const joinBtn        = document.getElementById("joinBtn");
const totalCount     = document.getElementById("totalCount");
const yourPosition   = document.getElementById("yourPosition");
const positionBanner = document.getElementById("positionBanner");
const bannerName     = document.getElementById("bannerName");
const bannerPos      = document.getElementById("bannerPos");
const toast          = document.getElementById("toastMsg");
const formSection    = document.getElementById("formSection");

// ── Firestore collection reference ─────────────────────────
const queueRef = collection(db, "queue");

// ── State ──────────────────────────────────────────────────
let currentQueueData = [];       // Live snapshot of full queue
let myDocId = localStorage.getItem("queueDocId") || null;
let myName  = localStorage.getItem("queueName")  || null;
let isOnline = navigator.onLine;
let unsubscribe = null; // Store the listener function for cleanup

// ── Utility: Validate Phone Number ─────────────────────────
function isValidPhoneNumber(phone) {
  // Accept formats: 9876543210, +919876543210, 987 654 3210, (987) 654-3210
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const cleaned = phone.replace(/\s/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

// ── Utility: Sanitize Input ───────────────────────────────
function sanitizeInput(str) {
  return str.replace(/[<>\"'&]/g, '').trim();
}

// ── Utility: Show Toast Notification ───────────────────────
function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast-custom show ${type}`;
  setTimeout(() => { toast.classList.remove("show"); }, 4000);
}

// ── Utility: Show Loading State ────────────────────────────
function setButtonLoading(button, isLoading, originalText) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Please wait...";
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || originalText;
  }
}

// ── Utility: Animate number change ─────────────────────────
function animateNumber(el, newVal) {
  const old = el.textContent;
  if (old !== String(newVal)) {
    el.textContent = newVal;
    el.classList.remove("pulse");
    void el.offsetWidth; // force reflow
    el.classList.add("pulse");
  }
}

// ── Offline Detection & Handling ───────────────────────────
function setupOfflineDetection() {
  function updateOnlineStatus() {
    isOnline = navigator.onLine;
    if (isOnline) {
      showToast("✓ Back online! Syncing queue...", "success");
      // Re-subscribe to queue
      subscribeToQueue();
    } else {
      showToast("⚠️ You're offline. Changes may not sync.", "error");
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Show offline indicator initially
  if (!isOnline) {
    showToast("⚠️ You're offline. Changes may not sync.", "error");
  }
}

// ── Real-time Queue Listener ────────────────────────────────
// Listens to the entire `queue` collection ordered by timestamp
// Updates the UI every time Firestore data changes
function subscribeToQueue() {
  const q = query(queueRef, orderBy("timestamp", "asc"));

  onSnapshot(q, (snapshot) => {
    currentQueueData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    const total = currentQueueData.length;

    // Update "Total waiting" stat
    animateNumber(totalCount, total);

    // Update "Your position" if user is in queue
    if (myDocId) {
      const myIndex = currentQueueData.findIndex(item => item.id === myDocId);

      if (myIndex !== -1) {
        const pos = myIndex + 1;
        animateNumber(yourPosition, pos);

        // Show personal banner
        positionBanner.classList.add("show");
        bannerName.textContent = myName || "You";
        bannerPos.textContent  = pos === 1
          ? "🎉 You're NEXT! Please get ready."
          : `Position #${pos} in line`;

        // Notify if moved to #1
        if (pos === 1) {
          showToast("⚡ You're next! Head to the barber's chair.", "success");
        }

        // Hide join form — they're already in queue
        if (formSection) {
          formSection.style.display = "none";
          document.getElementById("alreadyInQueue").style.display = "block";
        }
      } else {
        // User's turn is done (document deleted)
        animateNumber(yourPosition, "—");
        positionBanner.classList.remove("show");
        localStorage.removeItem("queueDocId");
        localStorage.removeItem("queueName");
        myDocId = null;
        myName  = null;
        if (formSection) {
          formSection.style.display = "block";
          document.getElementById("alreadyInQueue").style.display = "none";
          showToast("✅ Your session is complete. Thanks for visiting FADE!", "success");
        }
      }
    } else {
      animateNumber(yourPosition, "—");
    }
  }, (error) => {
    console.error("Queue listener error:", error);
    showToast("Connection error. Please refresh.", "error");
  });
}

// ── Join Queue Handler ──────────────────────────────────────
async function joinQueue(e) {
  e.preventDefault();

  const rawName = nameInput.value.trim();
  const rawPhone = phoneInput.value.trim();

  // Sanitize inputs to prevent XSS
  const name = sanitizeInput(rawName);
  const phone = sanitizeInput(rawPhone);

  // Basic validation - name
  if (!name || name.length < 2) {
    showToast("Please enter a valid name (at least 2 characters).", "error");
    nameInput.focus();
    return;
  }

  // Enhanced phone validation
  if (!isValidPhoneNumber(phone)) {
    showToast("Please enter a valid phone number (10+ digits).", "error");
    phoneInput.focus();
    return;
  }

  // Check if already in queue
  if (myDocId) {
    showToast("You're already in the queue! Check your position.", "error");
    return;
  }

  // Disable button while saving
  setButtonLoading(joinBtn, true, "✂  Join Queue");

  try {
    // Add document to Firestore `queue` collection
    const docRef = await addDoc(queueRef, {
      name:      name,
      phone:     phone,
      timestamp: serverTimestamp(),   // Server-side timestamp (accurate ordering)
      status:    "waiting"
    });

    // Save doc ID and name to localStorage (persists on refresh)
    localStorage.setItem("queueDocId", docRef.id);
    localStorage.setItem("queueName",  name);
    myDocId = docRef.id;
    myName  = name;

    showToast(`Welcome, ${name}! You've joined the queue.`, "success");
    joinForm.reset();

  } catch (err) {
    console.error("Error joining queue:", err);
    
    // Handle specific Firebase errors
    if (err.code === 'permission-denied') {
      showToast("Unable to join. Please try again later.", "error");
    } else if (err.code === 'network-request-failed') {
      showToast("Network error. Please check your connection.", "error");
    } else {
      showToast("Couldn't join the queue. Please try again.", "error");
    }
    
    setButtonLoading(joinBtn, false, "✂  Join Queue");
  }
}

// ── Leave Queue Handler (optional, for already-in-queue state) ──
window.leaveQueue = async function () {
  if (!myDocId) return;

  if (!confirm("Are you sure you want to leave the queue?")) return;

  try {
    const { deleteDoc } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );
    await deleteDoc(doc(db, "queue", myDocId));
    localStorage.removeItem("queueDocId");
    localStorage.removeItem("queueName");
    myDocId = null;
    myName  = null;
    showToast("You've left the queue.", "success");
  } catch (err) {
    showToast("Couldn't leave the queue. Try again.", "error");
  }
};

// ── Init ────────────────────────────────────────────────────
function init() {
  // Attach form submit handler
  joinForm.addEventListener("submit", joinQueue);

  // Setup offline detection
  setupOfflineDetection();

  // Check if user is already in queue (page refresh scenario)
  if (myDocId && formSection) {
    formSection.style.display = "none";
    document.getElementById("alreadyInQueue").style.display = "block";
  }

  // Start real-time listener
  subscribeToQueue();
}

// Run on DOM ready
document.addEventListener("DOMContentLoaded", init);
