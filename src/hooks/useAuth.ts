import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              nom: userData.nom || '',
              prenom: userData.prenom || '',
              role: userData.role,
              magasin_id: userData.magasin_id,
              image_url: userData.image_url,
              createdAt: userData.createdAt?.toDate() || new Date()
            });
          } else {
            // Si le document n'existe pas, le créer avec un rôle par défaut
            const newUserData = {
              email: firebaseUser.email!,
              nom: '',
              prenom: '',
              role: 'employe' as const,
              magasin_id: null,
              image_url: '',
              createdAt: new Date()
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
            
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              nom: '',
              prenom: '',
              role: 'employe',
              magasin_id: null,
              image_url: '',
              createdAt: new Date()
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};