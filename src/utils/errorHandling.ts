// Système de gestion et traduction des erreurs

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  type: 'field' | 'global';
  message: string;
  fieldErrors?: FieldError[];
}

// Mapping des erreurs communes du backend Django vers des messages français
const ERROR_MESSAGES: Record<string, string> = {
  // Erreurs d'authentification
  'Invalid credentials': 'Nom d\'utilisateur ou mot de passe incorrect',
  'Unable to log in with provided credentials': 'Nom d\'utilisateur ou mot de passe incorrect',
  'Authentication credentials were not provided': 'Veuillez vous connecter pour accéder à cette page',
  'Given token not valid for any token type': 'Session expirée, veuillez vous reconnecter',
  'Token is invalid or expired': 'Session expirée, veuillez vous reconnecter',
  
  // Erreurs d'inscription
  'User with this username already exists': 'Ce nom d\'utilisateur est déjà utilisé',
  'User with this email already exists': 'Cette adresse email est déjà utilisée',
  'A user with that username already exists': 'Ce nom d\'utilisateur est déjà utilisé',
  'A user with this email already exists': 'Cette adresse email est déjà utilisée',
  
  // Erreurs de validation des champs
  'This field is required': 'Ce champ est obligatoire',
  'This field may not be blank': 'Ce champ ne peut pas être vide',
  'Enter a valid email address': 'Veuillez saisir une adresse email valide',
  'Password too short': 'Le mot de passe doit contenir au moins 8 caractères',
  'Password too common': 'Ce mot de passe est trop courant, choisissez-en un plus sécurisé',
  'The password is too similar to the username': 'Le mot de passe ne doit pas être similaire au nom d\'utilisateur',
  'Ensure this field has no more than 150 characters': 'Ce champ ne peut pas dépasser 150 caractères',
  'Ensure this field has at least 1 characters': 'Ce champ doit contenir au moins 1 caractère',
  
  // Erreurs de permissions
  'You do not have permission to perform this action': 'Vous n\'avez pas les permissions nécessaires pour cette action',
  'Permission denied': 'Accès refusé',
  
  // Erreurs de serveur
  'Internal server error': 'Erreur interne du serveur, veuillez réessayer plus tard',
  'Service temporarily unavailable': 'Service temporairement indisponible, veuillez réessayer plus tard',
  'Connection error': 'Erreur de connexion, vérifiez votre connexion internet',
};

// Mapping des noms de champs vers des libellés français
const FIELD_LABELS: Record<string, string> = {
  username: 'Nom d\'utilisateur',
  email: 'Adresse email',
  password: 'Mot de passe',
  password1: 'Mot de passe',
  password2: 'Confirmation du mot de passe',
  first_name: 'Prénom',
  last_name: 'Nom',
  phone_number: 'Numéro de téléphone',
  address: 'Adresse',
  title: 'Titre',
  description: 'Description',
  price: 'Prix',
  location: 'Localisation',
  size: 'Superficie',
  property_type: 'Type de propriété',
};

/**
 * Traduit un message d'erreur anglais en français
 */
export function translateErrorMessage(message: string): string {
  // Recherche exacte dans le mapping
  if (ERROR_MESSAGES[message]) {
    return ERROR_MESSAGES[message];
  }
  
  // Recherche partielle pour les messages contenant des variables
  for (const [englishMsg, frenchMsg] of Object.entries(ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(englishMsg.toLowerCase())) {
      return frenchMsg;
    }
  }
  
  return message; // Retourne le message original si pas de traduction
}

/**
 * Obtient le libellé français d'un champ
 */
export function getFieldLabel(fieldName: string): string {
  return FIELD_LABELS[fieldName] || fieldName;
}

/**
 * Parse une réponse d'erreur du backend Django et la convertit en ApiError
 */
export function parseBackendError(errorData: any): ApiError {
  // Si c'est un objet avec des erreurs par champ (typique de Django REST)
  if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
    const fieldErrors: FieldError[] = [];
    
    for (const [fieldName, fieldMessages] of Object.entries(errorData)) {
      if (Array.isArray(fieldMessages)) {
        // Django renvoie souvent les erreurs comme un tableau
        fieldMessages.forEach((msg: string) => {
          fieldErrors.push({
            field: fieldName,
            message: translateErrorMessage(msg)
          });
        });
      } else if (typeof fieldMessages === 'string') {
        fieldErrors.push({
          field: fieldName,
          message: translateErrorMessage(fieldMessages)
        });
      }
    }
    
    if (fieldErrors.length > 0) {
      return {
        type: 'field',
        message: 'Veuillez corriger les erreurs ci-dessous',
        fieldErrors
      };
    }
  }
  
  // Si c'est une erreur globale avec un message 'detail'
  if (errorData.detail) {
    return {
      type: 'global',
      message: translateErrorMessage(errorData.detail)
    };
  }
  
  // Si c'est une erreur avec un message générique
  if (errorData.message) {
    return {
      type: 'global',
      message: translateErrorMessage(errorData.message)
    };
  }
  
  // Si c'est juste une chaîne
  if (typeof errorData === 'string') {
    return {
      type: 'global',
      message: translateErrorMessage(errorData)
    };
  }
  
  // Fallback pour les erreurs inconnues
  return {
    type: 'global',
    message: 'Une erreur inattendue s\'est produite'
  };
}

/**
 * Extrait les erreurs spécifiques à un champ donné
 */
export function getFieldErrors(apiError: ApiError, fieldName: string): string[] {
  if (apiError.type !== 'field' || !apiError.fieldErrors) {
    return [];
  }
  
  return apiError.fieldErrors
    .filter(error => error.field === fieldName)
    .map(error => error.message);
}

/**
 * Vérifie si une erreur concerne un champ spécifique
 */
export function hasFieldError(apiError: ApiError, fieldName: string): boolean {
  return getFieldErrors(apiError, fieldName).length > 0;
}