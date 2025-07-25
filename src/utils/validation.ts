// Validation des formulaires

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone: string): boolean => {
  // Validation pour les numéros de téléphone français
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

export const validatePrice = (price: string): boolean => {
  const priceRegex = /^\d+(?:\.\d{1,2})?$/;
  return priceRegex.test(price);
};

export const validateSize = (size: string): boolean => {
  const sizeRegex = /^\d+(?:\.\d{1,2})?$/;
  return sizeRegex.test(size);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Messages d'erreur
export const validationMessages = {
  email: 'Veuillez entrer une adresse email valide',
  password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  phone: 'Veuillez entrer un numéro de téléphone valide',
  price: 'Veuillez entrer un prix valide',
  size: 'Veuillez entrer une taille valide',
  required: 'Ce champ est requis',
  url: 'Veuillez entrer une URL valide',
};

// Validation de propriété
export const validateProperty = (data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = validationMessages.required;
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = validationMessages.required;
  }

  if (!data.price || !validatePrice(data.price.toString())) {
    errors.price = validationMessages.price;
  }

  if (!data.size || !validateSize(data.size.toString())) {
    errors.size = validationMessages.size;
  }

  if (!data.location || data.location.trim() === '') {
    errors.location = validationMessages.required;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};