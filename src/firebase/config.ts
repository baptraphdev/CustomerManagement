import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQT-DmA5gwxfcTh4YH0WXUEmclzjJbjjw",
  authDomain: "dev01-school-db-firebase.firebaseapp.com",
  databaseURL: "https://dev01-school-db-firebase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dev01-school-db-firebase",
  storageBucket: "dev01-school-db-firebase.firebasestorage.app",
  messagingSenderId: "978326961279",
  appId: "1:978326961279:web:1cc8eace083690222e134a",
  measurementId: "G-WPV12569JZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;