import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitaire pour combiner des classes CSS conditionnellement
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour éviter les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix en euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formate une superficie en m²
 */
export function formatSize(size: number): string {
  return `${size.toLocaleString('fr-FR')} m²`
}

/**
 * Formate une date relative (ex: "il y a 2 jours")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'à l\'instant'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`
}

/**
 * Formate une date au format français
 */
export function formatDate(date: string | Date): string {
  const target = typeof date === 'string' ? new Date(date) : date
  return target.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formate une date et heure au format français
 */
export function formatDateTime(date: string | Date): string {
  const target = typeof date === 'string' ? new Date(date) : date
  return target.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}

/**
 * Génère une couleur de fond aléatoire pour les avatars
 */
export function getAvatarColor(str: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ]
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/**
 * Obtient les initiales d'un nom complet
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Débounce une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Vérifie si une chaîne est une URL valide
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Convertit un type de propriété en libellé français
 */
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    land: 'Terrain',
    house: 'Maison',
    apartment: 'Appartement',
    commercial: 'Local commercial'
  }
  
  return labels[type] || type
}

/**
 * Convertit un type d'utilisateur en libellé français
 */
export function getUserTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    landowner: 'Propriétaire',
    buyer: 'Acheteur',
    admin: 'Administrateur'
  }
  
  return labels[type] || type
}

/**
 * Convertit un statut de transaction en libellé français
 */
export function getTransactionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Acceptée',
    rejected: 'Rejetée',
    completed: 'Terminée'
  }
  
  return labels[status] || status
}