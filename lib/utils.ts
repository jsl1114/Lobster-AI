import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_APP_URL_CIMS}${path}`
    : `${process.env.NEXT_PUBLIC_APP_URL_LOCAL}${path}`
}
