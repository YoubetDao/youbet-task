import { type ClassValue, clsx } from 'clsx'
import _ from 'lodash'
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

export const getRandomColor = (colors: string[]) => {
  return _.sample(colors)
}

export const capitalize = (str: string) => {
  return _.capitalize(str)
}

export const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}
