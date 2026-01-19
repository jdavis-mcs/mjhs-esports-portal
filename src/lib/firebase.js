// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// PASTE YOUR KEYS FROM FIREBASE CONSOLE HERE
const firebaseConfig = {
  apiKey: "AIzaSyBlW-nhvlaKqrDTSDIT0yN0IY8oqBFhOOY",
  authDomain: "mjhs-esports.firebaseapp.com",
  projectId: "mjhs-esports",
  storageBucket: "mjhs-esports.firebasestorage.app",
  messagingSenderId: "586504727075",
  appId: "1:586504727075:web:ec5707639e2dd654e9df96",
  measurementId: "G-4S7RNXD108"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();

// HELPER: Determine Role based on Email Domain
export const getRoleFromEmail = (email) => {
  if (email.endsWith('@madisonstudent.org')) {
    return 'student';
  } else if (email.endsWith('@madison.k12.in.us')) {
    return 'staff'; // Default for teachers/coaches (Admins can upgrade them later)
  }
  return 'guest'; // Everyone else (Parents/Public)
};