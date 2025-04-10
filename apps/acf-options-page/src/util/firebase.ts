import { initializeApp } from 'firebase/app';

export const firebase = initializeApp({
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
});
