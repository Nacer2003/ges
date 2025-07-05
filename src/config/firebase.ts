import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  // Remplacez par votre configuration Firebase
  apiKey: "AIzaSyBLlPBfbdecYAd7OOtPf57ejXSQemi8YKc",
  authDomain: "gestion6-2d32e.firebaseapp.com",
  projectId: "gestion6-2d32e",
  storageBucket: "gestion6-2d32e.firebasestorage.app",
  messagingSenderId: "771435706086",
  appId: "1:771435706086:web:db0907b6033875c5b0ad27",
  measurementId: "G-W07421339X"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Pour le développement local avec les émulateurs Firebase (optionnel)
if (import.meta.env.DEV) {
  // Décommentez ces lignes si vous utilisez les émulateurs Firebase
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;