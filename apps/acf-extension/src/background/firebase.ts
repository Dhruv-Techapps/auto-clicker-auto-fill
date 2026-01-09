import { initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence } from 'firebase/auth/web-extension';
import { FIREBASE_API_KEY, FIREBASE_BUCKET, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID } from '../common/environments';

const firebase = initializeApp({
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_BUCKET
});
firebase.automaticDataCollectionEnabled = false;
const auth = getAuth(firebase);
auth.setPersistence(indexedDBLocalPersistence);

/*if (process.env.CONNECT_EMULATOR === 'true') {
  // Dynamic imports only load when needed
  Promise.all([
    import('firebase/auth/web-extension'),
    import('firebase/firestore'),
    import('firebase/storage')
  ]).then(([{ connectAuthEmulator, signInWithEmailAndPassword }, { connectFirestoreEmulator, getFirestore }, { connectStorageEmulator, getStorage }]) => {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(getFirestore(auth.app), 'localhost', 8080);
    connectStorageEmulator(getStorage(auth.app), 'localhost', 9199);

    if (process.env.LOCAL_USER_EMAIL && process.env.LOCAL_USER_PASSWORD) {
      signInWithEmailAndPassword(auth, process.env.LOCAL_USER_EMAIL, process.env.LOCAL_USER_PASSWORD).then(console.log).catch(console.error);
    }
  });
}*/

export { auth };
