import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeJSONParse<T>(value?: string, defaultValue?: T): T | undefined {
  if (typeof value === 'undefined') {
    return defaultValue
  }

  try {
    return JSON.parse(value) as T
  } catch (error) {
    return defaultValue
  }
}
