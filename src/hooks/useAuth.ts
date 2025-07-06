import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await apiRequest('/api/auth/me/');
          setUser({
            id: userData.id.toString(),
            email: userData.email,
            nom: userData.last_name || '',
            prenom: userData.first_name || '',
            role: userData.role,
            magasin_id: userData.store?.toString() || null,
            image_url: userData.profile_image || '',
            createdAt: new Date(userData.date_joined)
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};