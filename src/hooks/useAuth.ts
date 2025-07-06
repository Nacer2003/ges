import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await authService.getMe();
          setUser({
            id: userData.id.toString(),
            email: userData.email,
            nom: userData.nom || '',
            prenom: userData.prenom || '',
            role: userData.role,
            magasin_id: userData.magasin_id?.toString() || null,
            image_url: userData.image_url || '',
            createdAt: new Date(userData.created_at)
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    
    setUser({
      id: response.user.id.toString(),
      email: response.user.email,
      nom: response.user.nom || '',
      prenom: response.user.prenom || '',
      role: response.user.role,
      magasin_id: response.user.magasin_id?.toString() || null,
      image_url: response.user.image_url || '',
      createdAt: new Date(response.user.created_at)
    });
    
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
};