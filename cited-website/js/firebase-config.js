/* =============================================================
   firebase-config.js
   -------------------------------------------------------------
   Beginner-friendly Firebase setup for CITED website.

   HOW TO USE:
   1. Go to https://console.firebase.google.com/
   2. Create a new project (e.g. "CITED-NGO").
   3. In Project Settings → "Your apps" → Web app, register an app.
   4. Copy the firebaseConfig values it gives you and paste them
      into the object below (replace each REPLACE_ME value).
   5. In the Firebase console, open "Firestore Database" → Create
      database → Start in test mode (for development).
   6. That's it. The Join form will save submissions to a
      collection named "members".
   ============================================================= */

// Import Firebase (uses the official CDN — no build tools needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 REPLACE these with the values from your Firebase project.
const firebaseConfig = {
    apiKey: "AIzaSyD0CaXG94v7XSbBNsqigK8iHJJcLsrJlwE",
    authDomain: "cited-ngo.firebaseapp.com",
    projectId: "cited-ngo",
    storageBucket: "cited-ngo.firebasestorage.app",
    messagingSenderId: "729322545610",
    appId: "1:729322545610:web:f2e127934990ec59d3ef33",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export so other files (like script.js) can use them
export { db };