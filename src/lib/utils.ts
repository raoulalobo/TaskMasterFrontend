import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fonction utilitaire pour combiner les classes CSS de manière conditionnelle
 * Utilise clsx pour la logique conditionnelle et twMerge pour résoudre les conflits Tailwind
 * @param inputs - Liste des classes CSS ou valeurs conditionnelles
 * @returns String des classes CSS combinées et optimisées
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}