import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  // Remplacez par votre configuration Firebase
  apiKey: "AIzaSyDwZUC1pgmO8qsuclI0ITp2yHa85roDuzI",
  authDomain: "gestion5.firebaseapp.com",
  projectId: "gestion5",
  storageBucket: "gestion5.firebasestorage.app",
  messagingSenderId: "627001487527",
  appId: "1:627001487527:web:bb131fac6c4e7f53912b82",
  measurementId: "G-GZPCM3XLYH"
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