// ============================================================
//  auth.js — Admin Authentication Module
//  FADE Barbershop Virtual Queue System
// ============================================================

// Simple password-based admin auth (for small business use)
// For larger deployments, consider using Firebase Auth

const ADMIN_PASSWORD = "FADE2024"; // CHANGE THIS to your desired password

// Check if admin is authenticated
function isAdminAuthenticated() {
  return localStorage.getItem("adminAuth") === "true";
}

// Login admin
function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("adminAuth", "true");
    return true;
  }
  return false;
}

// Logout admin
function adminLogout() {
  localStorage.removeItem("adminAuth");
}

// Require admin auth - returns true if authenticated, false otherwise
function requireAdminAuth() {
  if (!isAdminAuthenticated()) {
    return false;
  }
  return true;
}

// Export for use in other files
export { isAdminAuthenticated, adminLogin, adminLogout, requireAdminAuth, ADMIN_PASSWORD };

