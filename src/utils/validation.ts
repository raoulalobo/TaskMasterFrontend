// Utilitaires de validation côté client

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Valide une adresse email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      message: 'L\'adresse email est obligatoire'
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Veuillez saisir une adresse email valide'
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un nom d'utilisateur
 */
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return {
      isValid: false,
      message: 'Le nom d\'utilisateur est obligatoire'
    };
  }
  
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
    };
  }
  
  if (username.length > 150) {
    return {
      isValid: false,
      message: 'Le nom d\'utilisateur ne peut pas dépasser 150 caractères'
    };
  }
  
  // Vérifier les caractères autorisés (lettres, chiffres, @/./+/-/_)
  const usernameRegex = /^[a-zA-Z0-9@.+-_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et les caractères @.+-_'
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un mot de passe
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      message: 'Le mot de passe est obligatoire'
    };
  }
  
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins 8 caractères'
    };
  }
  
  // Vérifier que le mot de passe n'est pas trop simple
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'password123',
    '123456789', 'welcome', 'admin', 'root', 'user'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      isValid: false,
      message: 'Ce mot de passe est trop courant, choisissez-en un plus sécurisé'
    };
  }
  
  // Vérifier qu'il contient au moins 2 types de caractères différents
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const typesCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  
  if (typesCount < 2) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins 2 types de caractères (minuscules, majuscules, chiffres, symboles)'
    };
  }
  
  return { isValid: true };
}

/**
 * Valide la confirmation de mot de passe
 */
export function validatePasswordConfirmation(password: string, passwordConfirm: string): ValidationResult {
  if (!passwordConfirm) {
    return {
      isValid: false,
      message: 'La confirmation du mot de passe est obligatoire'
    };
  }
  
  if (password !== passwordConfirm) {
    return {
      isValid: false,
      message: 'Les mots de passe ne correspondent pas'
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un prénom ou nom
 */
export function validateName(name: string, fieldLabel: string): ValidationResult {
  if (!name) {
    return {
      isValid: false,
      message: `Le ${fieldLabel.toLowerCase()} est obligatoire`
    };
  }
  
  if (name.length < 1) {
    return {
      isValid: false,
      message: `Le ${fieldLabel.toLowerCase()} doit contenir au moins 1 caractère`
    };
  }
  
  if (name.length > 30) {
    return {
      isValid: false,
      message: `Le ${fieldLabel.toLowerCase()} ne peut pas dépasser 30 caractères`
    };
  }
  
  // Vérifier que le nom ne contient que des lettres, espaces, apostrophes et tirets
  const nameRegex = /^[a-zA-ZàáâäçéèêëïîôöùúûüÿñÀÁÂÄÇÉÈÊËÏÎÔÖÙÚÛÜŸÑ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: `Le ${fieldLabel.toLowerCase()} ne peut contenir que des lettres, espaces, apostrophes et tirets`
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un numéro de téléphone (optionnel)
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  // Le téléphone est optionnel
  if (!phone) {
    return { isValid: true };
  }
  
  // Nettoyer le numéro (supprimer espaces, tirets, etc.)
  const cleanPhone = phone.replace(/[\s\-().]/g, '');
  
  // Vérifier le format (doit commencer par + ou être 10 chiffres)
  const phoneRegex = /^(\+33|0)[1-9](\d{8})$|^\+\d{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      message: 'Veuillez saisir un numéro de téléphone valide (ex: 01 23 45 67 89 ou +33 1 23 45 67 89)'
    };
  }
  
  return { isValid: true };
}

/**
 * Valide une adresse (optionnelle)
 */
export function validateAddress(address: string): ValidationResult {
  // L'adresse est optionnelle
  if (!address) {
    return { isValid: true };
  }
  
  if (address.length > 500) {
    return {
      isValid: false,
      message: 'L\'adresse ne peut pas dépasser 500 caractères'
    };
  }
  
  return { isValid: true };
}

/**
 * Valide un champ requis générique
 */
export function validateRequired(value: string, fieldLabel: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      message: `${fieldLabel} est obligatoire`
    };
  }
  
  return { isValid: true };
}

/**
 * Valide tous les champs d'un formulaire de connexion
 */
export function validateLoginForm(username: string, password: string): Record<string, ValidationResult> {
  return {
    username: validateRequired(username, 'Le nom d\'utilisateur'),
    password: validateRequired(password, 'Le mot de passe')
  };
}

/**
 * Valide tous les champs d'un formulaire d'inscription
 */
export function validateRegisterForm(formData: {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
}): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {
    username: validateUsername(formData.username),
    email: validateEmail(formData.email),
    password1: validatePassword(formData.password1),
    password2: validatePasswordConfirmation(formData.password1, formData.password2),
    first_name: validateName(formData.first_name, 'Prénom'),
    last_name: validateName(formData.last_name, 'Nom'),
  };
  
  // Champs optionnels
  if (formData.phone_number) {
    results.phone_number = validatePhoneNumber(formData.phone_number);
  }
  
  if (formData.address) {
    results.address = validateAddress(formData.address);
  }
  
  // Validation spéciale : vérifier que le mot de passe n'est pas trop similaire au nom d'utilisateur
  if (formData.password1 && formData.username) {
    const passwordLower = formData.password1.toLowerCase();
    const usernameLower = formData.username.toLowerCase();
    
    if (passwordLower.includes(usernameLower) || usernameLower.includes(passwordLower)) {
      results.password1 = {
        isValid: false,
        message: 'Le mot de passe ne doit pas être similaire au nom d\'utilisateur'
      };
    }
  }
  
  return results;
}

/**
 * Vérifie si tous les résultats de validation sont valides
 */
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid);
}

/**
 * Obtient le premier message d'erreur d'un ensemble de résultats de validation
 */
export function getFirstErrorMessage(validationResults: Record<string, ValidationResult>): string | null {
  for (const result of Object.values(validationResults)) {
    if (!result.isValid && result.message) {
      return result.message;
    }
  }
  return null;
}