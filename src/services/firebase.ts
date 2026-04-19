// Firebase configuration and initialization
// Project: ai-study-planner-82108

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBp3jWAjAbQ924fgj_dHuyEba0TB502Lic",
  authDomain: "ai-study-planner-82108.firebaseapp.com",
  projectId: "ai-study-planner-82108",
  storageBucket: "ai-study-planner-82108.firebasestorage.app",
  messagingSenderId: "101983555734",
  appId: "1:101983555734:web:50b02ccf6666d4431772b7",
  measurementId: "G-R5VC43804Q",
};

// Prevent duplicate-app errors during Vite HMR hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Auth and Firestore instances to be used throughout the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
