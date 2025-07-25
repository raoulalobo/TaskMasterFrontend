import { useState, useEffect } from 'react';
import api, { User } from '../utils/api';

interface AuthState {
  isAuthenticated: boolean;
  userType: 'landowner' | 'buyer' | 'admin' | null;
  user: User | null;
  loading: boolean;
}

// Créer un contexte pour l'authentification
let authListeners: Array<() => void> = [];

const useAuth = (): AuthState & { updateAuth: () => void } => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    user: null,
    loading: true
  });

  // Fonction pour mettre à jour l'état d'authentification
  const updateAuth = async () => {
    const isAuthenticated = api.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        // Récupérer les informations de l'utilisateur courant
        const user = await api.getCurrentUser();
        setAuthState({
          isAuthenticated: true,
          userType: user.user_type,
          user: user,
          loading: false
        });
      } catch (error) {
        // Si la requête échoue, l'utilisateur n'est pas authentifié
        setAuthState({
          isAuthenticated: false,
          userType: null,
          user: null,
          loading: false
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        userType: null,
        user: null,
        loading: false
      });
    }
  };

  useEffect(() => {
    // Ajouter la fonction de mise à jour aux listeners
    authListeners.push(updateAuth);
    
    // Nettoyer les listeners quand le composant est démonté
    return () => {
      authListeners = authListeners.filter(listener => listener !== updateAuth);
    };
  }, []);

  useEffect(() => {
    updateAuth();
  }, []);

  return { ...authState, updateAuth };
};

// Fonction pour notifier tous les listeners d'un changement d'authentification
export const notifyAuthChange = () => {
  authListeners.forEach(listener => listener());
};

export default useAuth;