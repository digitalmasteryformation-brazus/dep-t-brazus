import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine des classes Tailwind en gérant les conflits (ex: "p-2" vs "p-4").
 * Convention shadcn/ui — utilisé par tous les composants UI.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
