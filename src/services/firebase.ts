// Firebase configuration and initialization
// Replace the firebaseConfig values with your own Firebase project credentials.
// Get them from: https://console.firebase.google.com → Project Settings → General → Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️  IMPORTANT: Replace these values with your own Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances to be used throughout the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
