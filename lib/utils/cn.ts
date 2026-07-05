import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names safely.
 * Combines clsx (conditional class composition) with tailwind-merge
 * (dedupes conflicting Tailwind utility classes, last one wins).
 *
 * @example
 *   cn('px-2 py-1', isActive && 'bg-brand-500', 'px-4')
 *   // => 'py-1 bg-brand-500 px-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
