import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebase = initializeApp({
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_BUCKET,
});

export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);
export default firebase;
