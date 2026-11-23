/**
 * ==========================================================================
 * GOOGLE SHEET CONFIGURATION - GUEST POSTING SITES & PRICING
 * ==========================================================================
 * 
 * Aap apna Google Sheet ka link yahan paste kar sakte hain:
 * 1. Google Sheet open karein.
 * 2. Top-right par "Share" button dabayein.
 * 3. General Access mein "Anyone with the link can view" select karein.
 * 4. "Copy link" karke neeche `sheetUrl` mein paste kar dein.
 * 
 * Website automatically:
 * - Google Sheet se live data fetch karegi.
 * - Table ko dynamically render karegi.
 * - Agar aap sheet mein koi site ya price update karein ge to website par
 *   bhi real-time auto-update ho jayega!
 * - "Open Full Site List" button se poori sheet open hogi.
 */

const GOOGLE_SHEET_CONFIG = {
  // Apna Google Sheet ka link yahan paste karein:
  sheetUrl: "https://docs.google.com/spreadsheets/d/1hL9xYebScN9lQxahsrSV98_eR15Eu-Erfhxem6Uxx2g/edit?usp=sharing",

  // Tab ka naam (optional, agar pehla sheet tab use karna ho to null chor dein):
  sheetTab: null,

  // Table mein maximum kitni rows display karni hain:
  maxPreviewRows: 15,

  // Auto-refresh interval (milliseconds mein, e.g. 60000 = har 1 minute baad auto-check):
  refreshIntervalMs: 60000
};

// Global scope mein expose
if (typeof window !== 'undefined') {
  window.GOOGLE_SHEET_CONFIG = GOOGLE_SHEET_CONFIG;
}
