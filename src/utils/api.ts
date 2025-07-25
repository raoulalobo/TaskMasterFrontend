// Service API complet pour TaskMarket
import { notifyAuthChange } from '../hooks/useAuth';
import { parseBackendError, ApiError } from './errorHandling';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Types pour nos données
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'landowner' | 'buyer' | 'admin';
  phone_number: string;
  address: string;
}

export interface Property {
  id: number;
  owner: number;
  owner_name: string;
  title: string;
  description: string;
  property_type: 'land' | 'house' | 'apartment' | 'commercial';
  price: number;
  location: string;
  size: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  images: PropertyImage[];
}

export interface PropertyImage {
  id: number;
  image: string;
  is_main: boolean;
}

export interface PropertyReport {
  id: number;
  property: number;
  reporter: number;
  reporter_name: string;
  title: string;
  description: string;
  created_at: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface VisitRequest {
  id: number;
  property: number;
  requester: number;
  requester_name: string;
  title: string;
  requested_date: string;
  description: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Transaction {
  id: number;
  property: number;
  property_title: string;
  buyer: number;
  buyer_name: string;
  seller: number;
  seller_name: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  agreed_price: number;
  created_at: string;
  updated_at: string;
}

export interface TelegramLinkCode {
  success: boolean;
  code?: string;
  expires_at?: string;
  bot_username?: string;
  instructions?: string;
  message?: string;
  telegram_username?: string;
}

export interface TelegramLinkStatus {
  linked: boolean;
  telegram_username?: string;
  telegram_id?: number;
  linked_at?: string;
  pending_code?: string;
  expires_at?: string;
  error?: string;
}

// Classe d'erreur personnalisée pour les erreurs API
export class ApiRequestError extends Error {
  public apiError: ApiError;
  public statusCode?: number;

  constructor(apiError: ApiError, statusCode?: number) {
    super(apiError.message);
    this.name = 'ApiRequestError';
    this.apiError = apiError;
    this.statusCode = statusCode;
  }
}

// Service API
class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  // Authentification
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  setUser(user: User) {
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    
    // Notifier les listeners d'un changement d'authentification
    notifyAuthChange();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User {
    const userStr = localStorage.getItem('authUser');
    if (!userStr) {
      throw new Error('No user data found');
    }
    return JSON.parse(userStr);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    
    return headers;
  }

  // Méthodes génériques
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData: any;
        
        try {
          errorData = await response.json();
        } catch {
          // Si on ne peut pas parser la réponse JSON, créer une erreur basique
          errorData = {
            detail: response.status === 500 
              ? 'Erreur interne du serveur, veuillez réessayer plus tard'
              : `Erreur HTTP: ${response.status}`
          };
        }
        
        // Gérer les cas spéciaux selon le code de statut et l'endpoint
        if (response.status === 401) {
          // Pour l'endpoint de connexion, préserver le message d'erreur original
          if (endpoint === '/login/') {
            // Le backend renvoie {"error": "Invalid credentials"}, on le transforme en format "detail"
            if (errorData.error) {
              errorData = { detail: errorData.error };
            }
          } else {
            // Pour les autres endpoints, c'est une session expirée
            errorData = { detail: 'Session expirée, veuillez vous reconnecter' };
          }
        } else if (response.status === 403) {
          errorData = { detail: 'Vous n\'avez pas les permissions nécessaires pour cette action' };
        } else if (response.status === 404) {
          errorData = { detail: 'Ressource non trouvée' };
        } else if (response.status >= 500) {
          errorData = { detail: 'Erreur du serveur, veuillez réessayer plus tard' };
        }
        
        const apiError = parseBackendError(errorData);
        throw new ApiRequestError(apiError, response.status);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la requête ${url}:`, error);
      
      // Si c'est déjà une ApiRequestError, la relancer
      if (error instanceof ApiRequestError) {
        throw error;
      }
      
      // Si c'est une erreur de réseau ou autre
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const apiError = parseBackendError('Erreur de connexion, vérifiez votre connexion internet');
        throw new ApiRequestError(apiError);
      }
      
      // Pour toute autre erreur inattendue
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
      const apiError = parseBackendError(errorMessage);
      throw new ApiRequestError(apiError);
    }
  }

  // Méthode spécifique pour les uploads de fichiers
  private async requestFileUpload<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        // Ne pas inclure Content-Type pour les uploads, le navigateur le gère
        'Authorization': this.token ? `Token ${this.token}` : '',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData: any;
        
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text().catch(() => '');
          errorData = {
            detail: text || (response.status === 500 
              ? 'Erreur interne du serveur, veuillez réessayer plus tard'
              : `Erreur HTTP: ${response.status}`)
          };
        }
        
        // Gérer les cas spéciaux selon le code de statut
        if (response.status === 401) {
          errorData = { detail: 'Session expirée, veuillez vous reconnecter' };
        } else if (response.status === 403) {
          errorData = { detail: 'Vous n\'avez pas les permissions nécessaires pour cette action' };
        } else if (response.status === 413) {
          errorData = { detail: 'Le fichier est trop volumineux' };
        } else if (response.status >= 500) {
          errorData = { detail: 'Erreur du serveur, veuillez réessayer plus tard' };
        }
        
        const apiError = parseBackendError(errorData);
        throw new ApiRequestError(apiError, response.status);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la requête ${url}:`, error);
      
      if (error instanceof ApiRequestError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const apiError = parseBackendError('Erreur de connexion, vérifiez votre connexion internet');
        throw new ApiRequestError(apiError);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
      const apiError = parseBackendError(errorMessage);
      throw new ApiRequestError(apiError);
    }
  }

  // Authentification
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const data = await this.request<{ token: string; user: User }>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.setToken(data.token);
    this.setUser(data.user);
    
    // Notifier les listeners d'un changement d'authentification
    notifyAuthChange();
    
    return data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.token}`,
        },
      });
    } catch {
      // Ignorer les erreurs de logout côté serveur
    }
    
    this.removeToken();
  }

  // Utilisateurs
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users/');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/`);
  }

  async createUser(userData: Omit<User, 'id'> & { password: string }): Promise<User> {
    console.log('Creating user with data:', userData);
    return this.request<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.request(`/users/${id}/`, {
      method: 'DELETE',
    });
  }

  // Propriétés
  async getProperties(): Promise<Property[]> {
    return this.request<Property[]>('/properties/');
  }

  async getProperty(id: number): Promise<Property> {
    return this.request<Property>(`/properties/${id}/`);
  }

  async createProperty(propertyData: Omit<Property, 'id' | 'owner' | 'owner_name' | 'created_at' | 'updated_at' | 'images'>): Promise<Property> {
    return this.request<Property>('/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id: number, propertyData: Partial<Property>): Promise<Property> {
    return this.request<Property>(`/properties/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: number): Promise<void> {
    await this.request(`/properties/${id}/`, {
      method: 'DELETE',
    });
  }

  // Images de propriétés
  async uploadPropertyImage(propertyId: number, image: File): Promise<PropertyImage> {
    // Vérification de sécurité
    if (!propertyId || propertyId === undefined || propertyId === null) {
      throw new Error(`ID de propriété invalide: ${propertyId}`);
    }
    
    if (!image || !(image instanceof File)) {
      throw new Error(`Fichier image invalide: ${image}`);
    }
    
    console.log(`API - Upload image pour propriété ID: ${propertyId}`);
    console.log(`API - Fichier image:`, image.name, image.size, 'bytes');
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('property', propertyId.toString());
    
    return this.requestFileUpload<PropertyImage>('/property-images/', {
      method: 'POST',
      body: formData,
    });
  }

  async deletePropertyImage(imageId: number): Promise<void> {
    await this.request(`/property-images/${imageId}/`, {
      method: 'DELETE',
    });
  }

  // Signalements de propriétés
  async createPropertyReport(propertyId: number, reportData: { title: string; description: string }): Promise<PropertyReport> {
    return this.request<PropertyReport>('/property-reports/', {
      method: 'POST',
      body: JSON.stringify({
        property: propertyId,
        title: reportData.title,
        description: reportData.description
      }),
    });
  }

  async getPropertyReports(): Promise<PropertyReport[]> {
    return this.request<PropertyReport[]>('/property-reports/');
  }

  // Demandes de visite
  async createVisitRequest(propertyId: number, requestData: { requested_date: string; description: string }): Promise<VisitRequest> {
    return this.request<VisitRequest>('/visit-requests/', {
      method: 'POST',
      body: JSON.stringify({
        property: propertyId,
        title: 'Demande de visite',
        requested_date: requestData.requested_date,
        description: requestData.description
      }),
    });
  }

  async getVisitRequests(): Promise<VisitRequest[]> {
    return this.request<VisitRequest[]>('/visit-requests/');
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions/');
  }

  async getTransaction(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}/`);
  }

  async createTransaction(transactionData: { property: number; agreed_price: number }): Promise<Transaction> {
    return this.request<Transaction>('/transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  // Telegram Bot
  async generateTelegramLinkCode(): Promise<TelegramLinkCode> {
    return this.request<TelegramLinkCode>('/telegram/generate-link-code/', {
      method: 'POST',
    });
  }

  async getTelegramLinkStatus(): Promise<TelegramLinkStatus> {
    return this.request<TelegramLinkStatus>('/telegram/link-status/');
  }
}

export default new ApiService(API_BASE_URL);